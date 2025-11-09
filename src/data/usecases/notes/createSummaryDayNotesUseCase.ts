import { ServerError } from "@/data/errors/ServerError";
import { NotesRepositoryProtocol } from "@/infra/db/interfaces/notesRepositoryProtocol";
import { RoutinesRepositoryProtocol } from "@/infra/db/interfaces/routinesRepositoryProtocol";
import { CreateSummaryDayNotesUseCaseProtocol } from "../interfaces/notes/createSummaryDayNotesUseCaseProtocol";
import { createSummaryDayNotesValidationSchema } from "../validation/notes/createSummaryDayNotesValidationSchema";

/**
 * Cria um resumo do dia baseado nas notas do usuário de forma estruturada e bonita,
 * sem depender de APIs externas de IA. Suporte específico para status: 'Não Realizado', 'Em Andamento', 'Concluído'.
 * Suporte específico para prioridades: 'Baixa', 'Média', 'Alta', 'Urgente'.
 * Salva o resumo em uma nota dedicada (com summaryDay preenchido) associada a uma rotina.
 * Exclui resumos existentes para a data antes de criar novo.
 */
export class CreateSummaryDayNotesUseCase
  implements CreateSummaryDayNotesUseCaseProtocol
{
  constructor(
    private readonly notesRepository: NotesRepositoryProtocol,
    private readonly routinesRepository: RoutinesRepositoryProtocol
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

  /**
   * Gera um resumo estruturado e bonito baseado nas notas.
   * Suporte específico para os status: 'Não Realizado', 'Em Andamento', 'Concluído'.
   * Suporte para prioridades: 'Baixa', 'Média', 'Alta', 'Urgente' – ordena destaques por urgência.
   * Agrupa por status em ordem lógica, mapeia emojis e calcula produtividade baseado em 'Concluído'.
   * Estrutura similar a um prompt para IA: resumo conciso com seções, métricas e insights.
   */
  private generateStructuredSummary(notes: any[], date: string): string {
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
      productivityMessage += `⚠️ ${urgentCount} itens de prioridade urgente identificados – ação imediata recomendada. `;
    } else if (highCount > 0) {
      productivityMessage += `🔥 ${highCount} itens de alta prioridade em foco. `;
    }
    productivityMessage +=
      completedCount === totalNotes
        ? `Excelente desempenho: dia integralmente produtivo.`
        : completedCount === 0
          ? `Oportunidade de avanço: todas as tarefas em fase inicial – impulsione o momentum.`
          : `Progresso sólido alcançado; otimize para maior eficiência no dia seguinte.`;

    const statusOrder = ["não realizado", "em andamento", "concluído"];

    const getEmojiForStatus = (statusKey: string): string => {
      if (statusKey.includes("não realizado")) return "❌";
      if (statusKey.includes("em andamento")) return "⏳";
      if (statusKey.includes("concluído")) return "✅";
      return "📝";
    };

    const getEmojiForPriority = (priorityKey: string): string => {
      if (priorityKey.includes("urgente")) return "🚨";
      if (priorityKey.includes("alta")) return "🔥";
      if (priorityKey.includes("média")) return "⚡";
      if (priorityKey.includes("baixa")) return "📌";
      return "📝";
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
      summary += `### 🌟 Prioridades Estratégicas\n`;
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
