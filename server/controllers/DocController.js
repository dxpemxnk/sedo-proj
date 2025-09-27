const DocService = require("../services/doc.service");

class DocController {
  static getAllDocsController = async (req, res) => {
    try {
      const docs = await DocService.getAllDoc();
      res.status(200).json({ message: "success", docs: docs }); // Даем клиенту данные с полем docs
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res
        .status(500)
        .json({ message: "Ошибка при получении документов", docs: [] });
    }
  };

  static getOneDocController = async (req, res) => {
    try {
      const { id } = req.params;
      const Doc = await DocService.getOneDoc(id);
      res.status(200).json({ message: "succcess getone", Doc });
    } catch (error) {
      res.status(500).json({ message: error.message, Docs: {} });
    }
  };

  static createDocController = async (req, res) => {
    const { name, description, category_id, signed, date_start, date_end } =
      req.body;

    const authUser = res.locals.user;

    if (!authUser) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    if (!name || !category_id) {
      res.status(400).json({ message: "Данные пустые" });
      return;
    }

    try {
      const doc = await DocService.createDoc({
        name,
        description,
        category_id,
        user_id: authUser.id,
        signed,
        date_start,
        date_end,
      });

      res.status(201).json({ message: "Успешно создано", doc });
    } catch (error) {
      console.error("Ошибка при создании документа:", error.message);
      res.status(500).json({ message: "Ошибка сервера", doc: {} });
    }
  };

  static deleteDocController = async (req, res) => {
    const { id } = req.params;
    const authUserId = res.locals.user.id;
    try {
      const countDeletedDocs = await DocService.deleteDoc(id, authUserId);
      if (countDeletedDocs > 0) {
        res.status(200).json({ message: "success delete" });
      } else {
        res.status(400).json({ message: "Not found to delete" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static updateDocController = async (req, res) => {
    const { name, description, category_id, signed, date_start, date_end } =
      req.body;
    const { id } = req.params;
    const authUserId = res.locals.user?.id;
    console.log("my id", id);
    if (!name || !category_id) {
      res.status(400).json({ message: "данные пустые для обновления" });
      return;
    }
    try {
      const countUpdated = await DocService.updateDoc(
        { name, description, category_id, signed, date_start, date_end },
        id,
        authUserId
      );
      if (countUpdated > 0) {
        const Doc = await DocService.getOneDoc(id);
        res.status(200).json({ message: "success update", Doc });
      } else {
        res.status(200).json({ message: "fail update" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message, Doc: {} });
    }
  };
}
module.exports = DocController;
