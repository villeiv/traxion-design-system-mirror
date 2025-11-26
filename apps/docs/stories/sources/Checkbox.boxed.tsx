import {Checkbox, Label, toast} from "@traxion-global/design-system";

const styles = {
    label: "hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5",
    checkbox: "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black",
    title: "text-sm leading-none font-medium",
    description: "text-muted-foreground text-sm",
    content: "grid gap-1.5 font-normal",
};

export default function CheckboxBoxed() {
    function onChange(value) {
        value
            ? toast.success("Notificaciones habilitadas")
            : toast.info("Notificaciones deshabilitadas");
    }

    return (
        <Label className={styles.label}>
            <Checkbox
                onCheckedChange={onChange}
                defaultChecked
                className={styles.checkbox}
            />
            <div className={styles.content}>
                <p className={styles.title}>Habilitar notificaciones</p>
                <p className={styles.description}>Puedes cambiar esta configuración en cualquier momento.</p>
            </div>
        </Label>
    );
}
