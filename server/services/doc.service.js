const { Doc, Category, User } = require("../db/models");
const { Op } = require("sequelize");

class DocService {
  static async getAllDoc(filters = {}) {
    try {
      const {
        search = "",
        category_id = null,
        signed = null,
        date_start = null,
        date_end = null,
        sortBy = "date_start",
        sortOrder = "DESC",
      } = filters;

      // Строим условия для where
      const whereConditions = {};

      // Поиск по названию и описанию
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Фильтр по категории
      if (category_id) {
        whereConditions.category_id = category_id;
      }

      // Фильтр по статусу подписи
      if (signed !== null && signed !== undefined && signed !== "") {
        whereConditions.signed = signed === "true" || signed === true;
      }

      // Фильтр по дате начала
      if (date_start) {
        whereConditions.date_start = { [Op.gte]: new Date(date_start) };
      }

      // Фильтр по дате окончания
      if (date_end) {
        whereConditions.date_end = { [Op.lte]: new Date(date_end) };
      }

      // Определяем порядок сортировки
      const order = [[sortBy, sortOrder.toUpperCase()]];

      const doc = await Doc.findAll({
        where: whereConditions,
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: User,
          },
        ],
        order,
      });
      return doc.map((doc) => ({
        ...doc.toJSON(),
        category: doc.category ? doc.category : null,
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getOneDoc(id) {
    try {
      const doc = await Doc.findOne({
        where: { id },
        include: [
          { model: Category, as: "category" },
          { model: User },
        ],
      });
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async createDoc(data) {
    try {
      const doc = await Doc.create(data);

      // Указываем псевдоним 'category' в include
      const newDoc = await Doc.findOne({
        where: { id: doc.id },
        include: [
          { model: Category, as: "category" },
          { model: User },
        ],
      });

      return newDoc;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async deleteDoc(id, authUserId) {
    try {
      const countDeletedDoc = await Doc.destroy({
        where: { id, user_id: authUserId },
      });
      return countDeletedDoc;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateDoc(data, id, user_id) {
    try {
      const [countUpdated] = await Doc.update(data, { where: { id, user_id } });
      return countUpdated;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async findAllDocsByName(name) {
    try {
      const doc = await Doc.findAll({
        where: {
          [Op.substring]: name,
        },
      });
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DocService;
