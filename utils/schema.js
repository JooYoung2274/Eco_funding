export function useVirtualId(schema) {
  schema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  schema.set("toJSON", {
    virtuals: true,
  });
}
