export const DatePickerAnatomy = `
### Componentes disponibles

Este módulo exporta cuatro componentes de selección de fechas y horas:

\`\`\`jsx
// Selector de fecha única
<DatePicker value={date} onChange={setDate} />

// Selector de rango de fechas
<DateRangePicker value={range} onChange={setRange} />

// Selector de hora (input nativo del navegador)
<TimePicker value="14:30" onChange={handleChange} />

// Selector combinado de fecha y hora
<DateTimePicker value={datetime} onChange={setDatetime} />
\`\`\`
`;
