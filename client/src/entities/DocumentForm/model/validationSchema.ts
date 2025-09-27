import * as Yup from 'yup';

export const documentValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Название обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  
  description: Yup.string()
    .required('Описание обязательно')
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(500, 'Описание не должно превышать 500 символов'),
  
  category_id: Yup.number()
    .required('Выберите категорию')
    .min(1, 'Выберите категорию'),
  
  date_start: Yup.date()
    .required('Дата начала обязательна')
    .max(Yup.ref('date_end'), 'Дата начала не может быть позже даты окончания'),
  
  date_end: Yup.date()
    .required('Дата окончания обязательна')
    .min(Yup.ref('date_start'), 'Дата окончания не может быть раньше даты начала'),
});