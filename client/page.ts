import { Html } from '../types';

export default interface Page {
    init(): void;
    setStylesheet(): void;
    HTML(): Html;
}