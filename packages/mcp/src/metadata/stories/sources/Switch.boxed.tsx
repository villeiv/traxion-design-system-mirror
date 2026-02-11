import {Label, toast, Switch} from "@traxion-global/design-system/react";

const styles = {
    label: "hover:bg-accent/50 flex items-center gap-6 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5",
    checkbox: "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black",
    title: "text-sm leading-none font-medium",
    description: "text-muted-foreground text-sm",
    content: "grid font-normal",
};

export default function SwitchBoxed() {
    function onChange(value) {
        value
            ? toast.success("Notificaciones habilitadas")
            : toast.info("Notificaciones deshabilitadas");
    }

    return (
        <Label className={styles.label}>
            <div className={styles.content}>
                <p className={styles.title}>Habilitar notificaciones</p>
                <p className={styles.description}>Puedes cambiar esta configuración en cualquier momento.</p>
            </div>
            <Switch
                onCheckedChange={onChange}
                defaultChecked
                className={styles.checkbox}
            />
        </Label>
    );
}
