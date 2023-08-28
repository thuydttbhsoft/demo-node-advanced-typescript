import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})
// Export the Blog class to be used as TypeScript type
export class Blog {
  // @prop()
  // _id: string;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  userId: string;
}

// Create the user model from the User class
const blogModel = getModelForClass(Blog);
export default blogModel;
