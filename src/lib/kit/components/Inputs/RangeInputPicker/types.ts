export interface RangeInputPickerInputProps {
    sliderParams?: {
        min: number;
        max: number;
        step?: number;
        marks?: number | number[];
    };
    showSlider?: boolean;
    showInputs?: boolean;
    separator?: string;
}

export interface RangeInputPickerValue {
    from?: number;
    to?: number;
}
