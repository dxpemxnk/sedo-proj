const { Doc, Category } = require("../db/models");
const { Op } = require("sequelize");

class DocService {
  static async getAllDoc() {
    try {
      const doc = await Doc.findAll({
        include: [
          {
            model: Category,
            as: "category", // Убедитесь, что ассоциация использует alias
          },
        ],
      });
      return doc.map((doc) => ({
        ...doc.toJSON(),
        category: doc.category ? doc.category : null, // Делаем category явным
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getOneDoc(id) {
    try {
      const doc = await Doc.findOne({
        where: { id },
        include: { model: Category, as: "category" },
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
        include: { model: Category, as: "category" },
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
