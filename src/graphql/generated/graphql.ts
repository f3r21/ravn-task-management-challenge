/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type CreateTaskInput = {
  assigneeId?: string | null | undefined;
  dueDate: string;
  name: string;
  pointEstimate: PointEstimate;
  status: Status;
  tags: Array<TaskTag>;
};

export type DeleteTaskInput = {
  id: string;
};

export type FilterTaskInput = {
  assigneeId?: string | null | undefined;
  dueDate?: string | null | undefined;
  name?: string | null | undefined;
  ownerId?: string | null | undefined;
  pointEstimate?: PointEstimate | null | undefined;
  status?: Status | null | undefined;
  tags?: Array<TaskTag> | null | undefined;
};

/** Estimate point for a task */
export type PointEstimate =
  | 'EIGHT'
  | 'FOUR'
  | 'ONE'
  | 'TWO'
  | 'ZERO';

/** Status for Task */
export type Status =
  | 'BACKLOG'
  | 'CANCELLED'
  | 'DONE'
  | 'IN_PROGRESS'
  | 'TODO';

/** Enum for tags for tasks */
export type TaskTag =
  | 'ANDROID'
  | 'IOS'
  | 'NODE_JS'
  | 'RAILS'
  | 'REACT';

export type UpdateTaskInput = {
  assigneeId?: string | null | undefined;
  dueDate?: string | null | undefined;
  id: string;
  name?: string | null | undefined;
  pointEstimate?: PointEstimate | null | undefined;
  position?: number | null | undefined;
  status?: Status | null | undefined;
  tags?: Array<TaskTag> | null | undefined;
};

/** Type of the User */
export type UserType =
  | 'ADMIN'
  | 'CANDIDATE';

export type TaskFieldsFragment = { id: string, name: string, status: Status, tags: Array<TaskTag>, dueDate: string, pointEstimate: PointEstimate, position: number, createdAt: string, assignee: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } | null, creator: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } };

export type UserFieldsFragment = { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string };

export type TasksQueryVariables = Exact<{
  input: FilterTaskInput;
}>;


export type TasksQuery = { tasks: Array<{ id: string, name: string, status: Status, tags: Array<TaskTag>, dueDate: string, pointEstimate: PointEstimate, position: number, createdAt: string, assignee: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } | null, creator: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } }> };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { users: Array<{ id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string }> };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { profile: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } };

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = { createTask: { id: string, name: string, status: Status, tags: Array<TaskTag>, dueDate: string, pointEstimate: PointEstimate, position: number, createdAt: string, assignee: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } | null, creator: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } } };

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { updateTask: { id: string, name: string, status: Status, tags: Array<TaskTag>, dueDate: string, pointEstimate: PointEstimate, position: number, createdAt: string, assignee: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } | null, creator: { id: string, fullName: string, email: string, avatar: string | null, type: UserType, createdAt: string, updatedAt: string } } };

export type DeleteTaskMutationVariables = Exact<{
  input: DeleteTaskInput;
}>;


export type DeleteTaskMutation = { deleteTask: { id: string } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const UserFieldsFragmentDoc = new TypedDocumentString(`
    fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}
    `, {"fragmentName":"UserFields"}) as unknown as TypedDocumentString<UserFieldsFragment, unknown>;
export const TaskFieldsFragmentDoc = new TypedDocumentString(`
    fragment TaskFields on Task {
  id
  name
  status
  tags
  dueDate
  pointEstimate
  position
  createdAt
  assignee {
    ...UserFields
  }
  creator {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}`, {"fragmentName":"TaskFields"}) as unknown as TypedDocumentString<TaskFieldsFragment, unknown>;
export const TasksDocument = new TypedDocumentString(`
    query Tasks($input: FilterTaskInput!) {
  tasks(input: $input) {
    ...TaskFields
  }
}
    fragment TaskFields on Task {
  id
  name
  status
  tags
  dueDate
  pointEstimate
  position
  createdAt
  assignee {
    ...UserFields
  }
  creator {
    ...UserFields
  }
}
fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<TasksQuery, TasksQueryVariables>;
export const UsersDocument = new TypedDocumentString(`
    query Users {
  users {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<UsersQuery, UsersQueryVariables>;
export const ProfileDocument = new TypedDocumentString(`
    query Profile {
  profile {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<ProfileQuery, ProfileQueryVariables>;
export const CreateTaskDocument = new TypedDocumentString(`
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    ...TaskFields
  }
}
    fragment TaskFields on Task {
  id
  name
  status
  tags
  dueDate
  pointEstimate
  position
  createdAt
  assignee {
    ...UserFields
  }
  creator {
    ...UserFields
  }
}
fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = new TypedDocumentString(`
    mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    ...TaskFields
  }
}
    fragment TaskFields on Task {
  id
  name
  status
  tags
  dueDate
  pointEstimate
  position
  createdAt
  assignee {
    ...UserFields
  }
  creator {
    ...UserFields
  }
}
fragment UserFields on User {
  id
  fullName
  email
  avatar
  type
  createdAt
  updatedAt
}`) as unknown as TypedDocumentString<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = new TypedDocumentString(`
    mutation DeleteTask($input: DeleteTaskInput!) {
  deleteTask(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<DeleteTaskMutation, DeleteTaskMutationVariables>;