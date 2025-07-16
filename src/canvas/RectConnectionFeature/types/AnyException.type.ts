import { InitException } from "../subclassesUtils/InitException.class";
import { RuntimeException } from "../subclassesUtils/RuntimeException.class";

export type AnyException = RuntimeException | InitException;
