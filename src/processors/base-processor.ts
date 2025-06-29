// ==================== processors/base-processor.ts ====================
import { ProcessorResult } from '../types';
import { Logger } from '../utils/logger';

export abstract class BaseFieldProcessor {
  protected filledCount = 0;
  protected errors: string[] = [];

  abstract process(): void;

  protected logProcessing(element: Element, identifier: string): void {
    Logger.debug(`Processing ${this.constructor.name}: ${identifier}`);
  }

  protected handleError(error: unknown, context: string): void {
    const message = error instanceof Error ? error.message : String(error);
    this.errors.push(`${context}: ${message}`);
    Logger.error(`${context}:`, error);
  }

  getResults(): ProcessorResult {
    return {
      filledCount: this.filledCount,
      errors: [...this.errors],
    };
  }

  protected reset(): void {
    this.filledCount = 0;
    this.errors = [];
  }
}
