export const updateMaterialSchema = {
  nome: {
    required: false,
    type: "string",
  },
  quantidade: {
    required: false,
    type: "number",
    min: 0,
  },
};
