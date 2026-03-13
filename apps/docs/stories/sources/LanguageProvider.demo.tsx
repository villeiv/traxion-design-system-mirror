import {
    DatePicker,
    DateRangePicker,
    FileDropZone,
    LanguageProvider,
    type DesignSystemLanguage,
} from "@traxion-global/design-system/react";

export default function LanguageProviderDemo({
    language = "es",
}: {
    language?: DesignSystemLanguage;
}) {
    return (
        <LanguageProvider language={language}>
            <div className="flex flex-col gap-2 w-80">
                <DatePicker />
                <DateRangePicker />
                <FileDropZone onFiles={() => {}} />
            </div>
        </LanguageProvider>
    );
}
