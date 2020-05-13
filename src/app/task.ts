export class Task {
    private readonly _id: number;
    private _name: string;
    private _description: string;
    private _notificationDate: string;
    private _importance: string;
    private _style: string;

    constructor(id: number, name: string, description: string, notificationDate: string, importance: string, style: string) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._notificationDate = notificationDate;
        this._importance = importance;
        this._style = style;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get notificationDate(): string {
        return this._notificationDate;
    }

    set notificationDate(value: string) {
        this._notificationDate = value;
    }

    get importance(): string {
        return this._importance;
    }

    set importance(value: string) {
        this._importance = value;
    }

    get style(): string {
        return this._style;
    }

    set style(value: string) {
        this._style = value;
    }
}