import { InitException } from "../subclasses/InitException.class";
import { RuntimeException } from "../subclasses/RuntimeException.class";

export type AnyException = RuntimeException | InitException;
