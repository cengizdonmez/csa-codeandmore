export interface PopupCreateFields {
    title:      string;
    content:    string;
    pages:      string;
    startDate:  Date;
    endDate:    Date;
}

export interface PopupListItem {
    id:         number;
    title:      string;
    content:    string;
    pages:      string;
    startDate:  Date;
    endDate:    Date;
    token:      string;
}