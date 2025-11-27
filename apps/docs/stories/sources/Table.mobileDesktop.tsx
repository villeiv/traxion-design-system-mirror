import {Badge, Table, TableBody, TableCell, TableRow} from "@traxion-global/design-system";

export default function TableMobileDesktop(){
    return (
        <Table className={"w-full border"}>
            <TableBody>
                {[
                    { invoiceId: 'F001', concept:"Facturación Roche julio 2025", status: "Pagado", paymentMethod: 'TDC', total: '$250,000.00' },
                    { invoiceId: 'F002', concept:"Facturación mayo 2025", status: "Pendiente", paymentMethod: 'TDD', total: '$450,000.00' },
                    { invoiceId: 'F003', concept:"Facturación almacenamiento y distribución abril 2025", status: "Vencido", paymentMethod: 'EFECTIVO', total: '$325,000.00' },
                ].map((data, index) => (
                    <MobileRow key={"mobile-"+index} {...data} />
                ))}
            </TableBody>
        </Table>
    )
}

function MobileRow({ invoiceId, status, concept, paymentMethod, total }){

    const mobileRowStyles = {
        row: "text-xs text-dark",
        cell: "space-y-2",
        header: "flex justify-between items-start gap-4",
        HeaderInternal: "min-w-0",
        title: "text-sm font-semibold",
        subLine: "w-full",
        dataWrapper: "grid grid-cols-3 gap-2 text-xs",
        actionsWrapper: "flex shrink-0",
        label: "text-[0.65rem] text-muted-foreground",
        value: "text-sm font-medium"
    };

    return <TableRow className={mobileRowStyles.row}>
        <TableCell className={mobileRowStyles.cell}>
            {/* Header */}
            <div className={mobileRowStyles.header}>
                <div className={mobileRowStyles.HeaderInternal}>
                    { <p className={mobileRowStyles.title}>{concept}</p> }
                    { <p className={mobileRowStyles.subLine}>{invoiceId}</p> }
                </div>
            </div>
            {/* Data */}
            <div className={mobileRowStyles.dataWrapper}>
                {[
                    { label: "Estado", value: <Badge variant={"gray"}>{status}</Badge> },
                    { label: "Forma de pago", value: paymentMethod },
                    { label: "Total", value: total }
                ]?.map((item, idx) => (
                    <div key={"col"+idx}>
                        {item.label != null && (
                            <p className={mobileRowStyles.label}>{item.label}</p>
                        )}
                        <div className={mobileRowStyles.value}>{item.value}</div>
                    </div>
                ))}
            </div>
        </TableCell>
    </TableRow>
}