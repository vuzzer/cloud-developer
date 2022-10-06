import * as uuid from 'uuid'
import * as dataLayer from './todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { attachmentS3Bucket, getUploadUrl } from './attachmentUtils'

export async function getTodosForUser(currentUserId: string): Promise<TodoItem[]> {
  return dataLayer.getTodos(currentUserId);
}

const initialTodoState = {
  done: false
};

export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  return await dataLayer.createTodo({
    userId: userId,
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    ...initialTodoState,
    ...newTodo
  });
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updatedTodo: TodoUpdate
): Promise<any> {
  return await dataLayer.updateTodo(todoId, userId, updatedTodo);
}

export async function deleteTodo(todoId: string, userId: string): Promise<any> {
  return dataLayer.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
) {
  const imageId = uuid.v4();

  const uploadUrl = getUploadUrl(imageId);

  await dataLayer.setAttachmentUrl(
    todoId,
    userId,
    `https://${attachmentS3Bucket}.s3.amazonaws.com/${imageId}`
  );
  return uploadUrl;
}