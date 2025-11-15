import { ILike, Repository, getRepository } from "typeorm";
import { Notification } from "@/domain/entities/postgres/Notification";
import { NotificationModel } from "@/domain/models/postgres/NotificationModel";
import { User } from "@/domain/entities/postgres/User";
import { NotificationRepositoryProtocol } from "../interfaces/notificationRepositoryProtocol";
import { NotFoundError } from "@/data/errors/NotFoundError";

export class NotificationRepository implements NotificationRepositoryProtocol {
  private repository: Repository<Notification>;

  constructor() {
    this.repository = getRepository(Notification);
  }

  /**
   * Cria uma nova Notificação no banco de dados
   * @param {NotificationRepositoryProtocol.CreateNotification} data - Os dados para criação da Notificação
   */
  async create(
    data: NotificationRepositoryProtocol.CreateNotification
  ): Promise<NotificationModel> {
    const notification = this.repository.create({
      title: data.title,
      entity: data.entity,
      idEntity: data.idEntity,
      isRead: false,
      user: { id: data.userId } as User,
    });

    const savedNotification = await this.repository.save(notification);
    return {
      id: savedNotification.id,
      title: savedNotification.title,
      entity: savedNotification.entity,
      idEntity: savedNotification.idEntity,
      isRead: savedNotification.isRead,
      user_id: savedNotification.user.id,
      created_at: savedNotification.created_at,
      updated_at: savedNotification.updated_at,
    };
  }

  /**
   * Busca uma Notificação por ID e ID do usuário
   * @param {NotificationRepositoryProtocol.FindByIdAndUserIdParams} data - Os dados para busca
   * @param {string} data.id - ID da Notificação
   * @param {string} data.userId - ID do usuário
   * @returns {Promise<NotificationModel | null>} A Notificação encontrada ou null se não existir
   */
  async findByIdAndUserId(
    data: NotificationRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<NotificationModel | null> {
    const notification = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["user"],
    });

    if (!notification) return null;

    return {
      id: notification.id,
      title: notification.title,
      entity: notification.entity,
      idEntity: notification.idEntity,
      isRead: notification.isRead,
      user_id: notification.user.id,
      created_at: notification.created_at,
      updated_at: notification.updated_at,
    };
  }

  /**
   * Busca Notificações por ID do usuário
   * @param {NotificationRepositoryProtocol.FindByUserIdParams} data - Os dados para busca
   * @param {string} data.userId - ID do usuário
   * @returns {Promise<{ notifications: NotificationModel[]; total: number }>} Lista de Notificações encontradas
   */
  async findByUserId(
    data: NotificationRepositoryProtocol.FindByUserIdParams
  ): Promise<{ notifications: NotificationModel[]; total: number }> {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;
    const search = data.search || "";
    const sortBy = data.sortBy || "created_at";
    const order = data.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const isReadFilter =
      data.isRead !== undefined ? { isRead: data.isRead } : {};

    const whereCondition = search
      ? [
          {
            title: ILike(`%${search}%`),
            user: { id: data.userId },
            ...isReadFilter,
          },
        ]
      : { user: { id: data.userId }, ...isReadFilter };

    const [notifications, total] = await this.repository.findAndCount({
      where: whereCondition,
      relations: ["user"],
      take: limit,
      skip: offset,
      order: { [sortBy]: order },
    });

    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      entity: notification.entity,
      idEntity: notification.idEntity,
      isRead: notification.isRead,
      user_id: notification.user.id,
      created_at: notification.created_at,
      updated_at: notification.updated_at,
    }));

    return {
      notifications: formattedNotifications,
      total,
    };
  }

  /**
   * Atualiza uma Notificação no banco de dados (principalmente para marcar como lida)
   * @param {NotificationRepositoryProtocol.UpdateNotificationParams} data - Os dados para atualização
   * @param {string} data.id - ID da Notificação
   * @param {string} data.userId - ID do usuário
   * @param {boolean} [data.isRead] - Novo status de lida
   * @returns {Promise<NotificationModel>} A Notificação atualizada
   * @throws {NotFoundError} Quando a Notificação não é encontrada
   */
  async updateNotification(
    data: NotificationRepositoryProtocol.UpdateNotificationParams
  ): Promise<NotificationModel> {
    const notification = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["user"],
    });

    if (!notification) {
      throw new NotFoundError(
        `Notificação com ID ${data.id} não encontrada para este usuário`
      );
    }

    if (data.isRead !== undefined) notification.isRead = data.isRead;

    const updatedNotification = await this.repository.save(notification);
    return {
      id: updatedNotification.id,
      title: updatedNotification.title,
      entity: updatedNotification.entity,
      idEntity: updatedNotification.idEntity,
      isRead: updatedNotification.isRead,
      user_id: updatedNotification.user.id,
      created_at: updatedNotification.created_at,
      updated_at: updatedNotification.updated_at,
    };
  }

  /**
   * Deleta uma notificação do banco de dados
   * @param {NotificationRepositoryProtocol.DeleteNotificationParams} data - Os dados para deleção
   * @param {string} data.id - ID da notificação
   * @param {string} data.userId - ID do usuário
   * @returns {Promise<void>} Não retorna valor
   * @throws {NotFoundError} Quando a notificação não é encontrada
   */
  async deleteNotification(
    data: NotificationRepositoryProtocol.DeleteNotificationParams
  ): Promise<void> {
    const notification = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
    });

    if (!notification) {
      throw new NotFoundError(
        `Notificação com ID ${data.id} não encontrada para este usuário`
      );
    }

    await this.repository.delete({
      id: data.id,
      user: { id: data.userId },
    });
  }
}
