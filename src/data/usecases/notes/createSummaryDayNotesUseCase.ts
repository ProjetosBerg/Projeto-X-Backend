import { ServerError } from "@/data/errors/ServerError";
import { NotesRepositoryProtocol } from "@/infra/db/interfaces/notesRepositoryProtocol";
import { RoutinesRepositoryProtocol } from "@/infra/db/interfaces/routinesRepositoryProtocol";
import { NotificationRepositoryProtocol } from "@/infra/db/interfaces/notificationRepositoryProtocol";
import { CreateSummaryDayNotesUseCaseProtocol } from "../interfaces/notes/createSummaryDayNotesUseCaseProtocol";
import { createSummaryDayNotesValidationSchema } from "../validation/notes/createSummaryDayNotesValidationSchema";
import { NotificationModel } from "@/domain/models/postgres/NotificationModel";

// NOVO: Socket.IO
import { getIo } from "@/lib/socket";
import logger from "@/loaders/logger";

/**
 * Cria um resumo do dia baseado nas notas do usuário de forma estruturada e bonita,
 * sem depender de APIs externas de IA. Suporte específico para status e prioridades.
 */
export class CreateSummaryDayNotesUseCase
  implements CreateSummaryDayNotesUseCaseProtocol
{
  constructor(
    private readonly notesRepository: NotesRepositoryProtocol,
    private readonly routinesRepository: RoutinesRepositoryProtocol,
    private readonly notificationRepository: NotificationRepositoryProtocol
  ) {}

  async handle(
    data: CreateSummaryDayNotesUseCaseProtocol.Params
  ): Promise<string> {
    try {
      const validatedData =
        await createSummaryDayNotesValidationSchema.validate(data, {
          abortEarly: false,
        });

      if (!validatedData) {
        throw new ServerError("Dados inválidos para criação do resumo do dia.");
      }

      const { notes } = await this.notesRepository.findByUserIdAndDate({
        userId: validatedData.userId,
        date: validatedData.date,
      });

      if (notes.length === 0) {
        return "Nenhuma nota encontrada para esta data.";
      }

      const summary = this.generateStructuredSummary(notes, validatedData.date);

      let routineId = validatedData.routine_id;
      let routineModel;
      if (!routineId) {
        const { routines } = await this.routinesRepository.findByUserId({
          userId: validatedData.userId,
          page: 1,
          limit: 1,
        });
        if (routines.length === 0) {
          throw new ServerError(
            "Nenhuma rotina encontrada para este usuário. Crie uma rotina antes de gerar resumos."
          );
        }
        routineId = routines[0].id;
        routineModel = routines[0];
      }

      const dateParts = validatedData.date.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);
      const localDate = new Date(year, month, day);
      const formattedDate = localDate.toLocaleDateString("pt-BR");

      const existingSummary =
        await this.notesRepository.findByUserIdAndSummaryDate({
          userId: validatedData.userId,
          formattedDate,
        });

      if (existingSummary) {
        await this.notesRepository.deleteNote({
          id: existingSummary.id,
          userId: validatedData.userId,
        });
      }

      const summaryNote = await this.notesRepository.create({
        activity: `Resumo do Dia - ${formattedDate}`,
        description: `Resumo estruturado das atividades do dia ${formattedDate}.`,
        summaryDay: summary,
        routine_id: routineId,
        userId: validatedData.userId,
        status: "",
        priority: "",
      });

      const newNotification = await this.notificationRepository.create({
        title: `Resumo do dia gerado: ${formattedDate}`,
        entity: "Anotação",
        idEntity: summaryNote.id,
        userId: validatedData.userId,
        path: `/anotacoes`,
        payload: {
          date: validatedData.date,
          formattedDate: formattedDate,
          routine_id: routineId,
          totalNotes: notes.length,
          summaryPreview: summary.substring(0, 200) + "...",
          summary: summary,
          routines: routineModel,
        } as NotificationModel["payload"],
        typeOfAction: "Criação",
      });

      const countNewNotification =
        await this.notificationRepository.countNewByUserId({
          userId: validatedData.userId,
        });

      const io = getIo();
      const now = new Date();
      if (io && newNotification) {
        const notificationData = {
          id: newNotification.id,
          title: newNotification.title,
          entity: newNotification.entity,
          idEntity: newNotification.idEntity,
          path: newNotification.path,
          typeOfAction: newNotification.typeOfAction,
          payload: newNotification.payload,
          createdAt: new Date(now.getTime() + 6 * 60 * 60 * 1000),
          countNewNotification,
        };

        io.to(`user_${validatedData.userId}`).emit(
          "newNotification",
          notificationData
        );
        logger.info(
          `Notificação de resumo do dia emitida via Socket.IO para userId: ${validatedData.userId} (count: ${countNewNotification})`
        );
      } else {
        logger.warn(
          "Socket.IO não inicializado ou notificação nula → resumo gerado, mas sem push em tempo real"
        );
      }

      return summary;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a geração do resumo";
      throw new ServerError(
        `Falha na criação do resumo do dia: ${errorMessage}`
      );
    }
  }

  // ... o método generateStructuredSummary permanece exatamente igual (perfeito!) ...
  private generateStructuredSummary(notes: any[], date: string): string {
    // ... seu código incrível de geração de resumo (não alterado) ...
    const dateParts = date.split("-");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const localDate = new Date(year, month, day);
    const formattedDate = localDate.toLocaleDateString("pt-BR");

    const statusMap: { [key: string]: any[] } = {};
    notes.forEach((note) => {
      const statusKey = (note.status || "sem status").toLowerCase();
      const originalStatus = note.status || "Sem Status";
      if (!statusMap[statusKey]) statusMap[statusKey] = [];
      statusMap[statusKey].push({ ...note, displayStatus: originalStatus });
    });

    const priorityCounts: { [key: string]: number } = {};
    notes.forEach((note) => {
      const priorityKey = (note.priority || "sem prioridade").toLowerCase();
      priorityCounts[priorityKey] = (priorityCounts[priorityKey] || 0) + 1;
    });

    const completionStatuses = ["concluído"];
    const completedNotes = Object.values(statusMap)
      .flat()
      .filter((note) =>
        completionStatuses.some((status) =>
          note.status?.toLowerCase().includes(status)
        )
      );
    const totalNotes = notes.length;
    const completedCount = completedNotes.length;
    const notRealizedCount = statusMap["não realizado"]?.length || 0;
    const urgentCount = priorityCounts["urgente"] || 0;
    const highCount = priorityCounts["alta"] || 0;
    const productivity =
      totalNotes > 0 ? Math.round((completedCount / totalNotes) * 100) : 0;

    let productivityMessage = `*${completedCount}/${totalNotes} atividades concluídas (${productivity}%). `;
    if (notRealizedCount > 0) {
      productivityMessage += `(${notRealizedCount} pendentes – considere revisão para o próximo ciclo.) `;
    }
    if (urgentCount > 0) {
      productivityMessage += `Warning: ${urgentCount} itens de prioridade urgente identificados – ação imediata recomendada. `;
    } else if (highCount > 0) {
      productivityMessage += `Fire: ${highCount} itens de alta prioridade em foco. `;
    }
    productivityMessage +=
      completedCount === totalNotes
        ? `Excelente desempenho: dia integralmente produtivo.`
        : completedCount === 0
          ? `Oportunidade de avanço: todas as tarefas em fase inicial – impulsione o momentum.`
          : `Progresso sólido alcançado; otimize para maior eficiência no dia seguinte.`;

    const statusOrder = ["não realizado", "em andamento", "concluído"];

    const getEmojiForStatus = (statusKey: string): string => {
      if (statusKey.includes("não realizado")) return "Cross Mark";
      if (statusKey.includes("em andamento")) return "Hourglass Not Done";
      if (statusKey.includes("concluído")) return "Check Mark Button";
      return "Memo";
    };

    const getEmojiForPriority = (priorityKey: string): string => {
      if (priorityKey.includes("urgente")) return "Police Car Light";
      if (priorityKey.includes("alta")) return "Fire";
      if (priorityKey.includes("média")) return "High Voltage";
      if (priorityKey.includes("baixa")) return "Pushpin";
      return "Memo";
    };

    const formatNotesList = (
      noteList: any[],
      title: string,
      emoji: string
    ): string => {
      if (noteList.length === 0) return "";
      const listItems = noteList
        .map((note) => {
          const timeRange = `${note.startTime || "Não especificado"} - ${note.endTime || "Não especificado"}`;
          const activityType = note.activityType || "Não classificada";
          const priority = note.priority || "Não priorizada";
          const description = note.description || "Sem detalhes adicionais.";
          const collaborators =
            note.collaborators?.length > 0
              ? `Colaboradores: ${note.collaborators.join(", ")}`
              : "";
          const comment = note.comments?.[0]
            ? `*Observação:* "${note.comments[0].text}" (por ${note.comments[0].author})`
            : "";

          let item = `• **${note.activity || "Atividade não nomeada"}** (${priority}, ${activityType}): ${description}.  \n`;
          item += `  *Período:* ${timeRange}  \n`;
          if (collaborators) item += `  *${collaborators}*  \n`;
          if (comment) item += `  ${comment}  \n`;
          return item;
        })
        .join("\n\n");
      return `### ${emoji} ${title}\n${listItems}\n\n`;
    };

    let summary = `## Relatório Diário de Atividades - ${formattedDate}\n\n`;
    summary += `**Panorama Executivo:** ${totalNotes} tarefas registradas. ${productivityMessage}\n\n`;

    statusOrder.forEach((statusKey) => {
      const notesGroup = statusMap[statusKey];
      if (notesGroup && notesGroup.length > 0) {
        const displayTitle = notesGroup[0].displayStatus;
        const emoji = getEmojiForStatus(statusKey);
        summary += formatNotesList(notesGroup, displayTitle, emoji);
      }
    });

    const priorityLevels = { urgente: 4, alta: 3, média: 2, baixa: 1 };
    const priorityNotes = notes
      .filter(
        (note) => priorityLevels[(note.priority || "").toLowerCase()] >= 3
      )
      .sort(
        (a, b) =>
          (priorityLevels[(b.priority || "").toLowerCase()] || 0) -
          (priorityLevels[(a.priority || "").toLowerCase()] || 0)
      )
      .slice(0, 5);
    if (priorityNotes.length > 0) {
      summary += `### Star Prioridades Estratégicas\n`;
      priorityNotes.forEach((note) => {
        const statusKey = (note.status || "").toLowerCase();
        const priorityKey = (note.priority || "").toLowerCase();
        const statusEmoji = getEmojiForStatus(statusKey);
        const priorityEmoji = getEmojiForPriority(priorityKey);
        summary += `- ${statusEmoji} ${priorityEmoji} **${note.activity}**: ${note.description || "Sem detalhes adicionais."} (${note.displayStatus || note.status}, ${note.priority})\n`;
      });
      summary += `*Recomendação:* ${priorityNotes.length} elementos de alta ou urgente relevância – inicie pelas urgentes para mitigar riscos. Itens de menor prioridade podem ser adiados com segurança.\n\n`;
    }

    return summary;
  }
}
