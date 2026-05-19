# Checklist de Testing - Tester JUN12 (Semana 1)

Registro y control de las pruebas funcionales para `https://admin.saludti.es/` bajo el prefijo **JUN12**.

## 📋 Escenarios de Prueba a Ejecutar

### 👤 Bloque 1: Crear Paciente
- [ ] **Caso 1.1 (Datos Válidos):** Crear un paciente válido con nombre `JUN12-Paciente-Valido`, rellenando campos obligatorios correctamente.
- [ ] **Caso 1.2 (Validación de Vacíos):** Intentar guardar un paciente con el nombre vacío. Verificar que salta una alerta controlada y no se cuelga la app.
- [ ] **Caso 1.3 (Validación de Formatos):** Intentar crear un paciente con un email inválido (ej: `pruebas.com`) y un DNI inválido (ej: `123`).
- [ ] **Caso 1.4 (Caracteres Especiales):** Crear un paciente con caracteres especiales en el nombre `JUN12-Paciente-!@#$%-Test` y comprobar estabilidad.

### 🩺 Bloque 2: Crear Doctor
- [ ] **Caso 2.1 (Datos Válidos):** Crear un doctor válido con nombre `JUN12-Doctor-Valido`, asignándole especialidad y clínica.
- [ ] **Caso 2.2 (DNI/Email Duplicado):** Intentar crear un segundo doctor con el mismo DNI o correo que el anterior para comprobar la validación de duplicados.
- [ ] **Caso 2.3 (Clínica Obligatoria):** Comprobar si exige seleccionar una clínica existente al dar de alta al doctor.

### 📅 Bloque 3: Calendario / Agenda
- [ ] **Caso 3.1 (Rango de Disponibilidad):** Definir una franja de disponibilidad para `JUN12-Doctor-Valido`.
- [ ] **Caso 3.2 (Vistas de Calendario):** Alternar entre vista mensual, semanal y diaria. Comprobar que no hay solapamientos visuales ni descuadres estéticos.
- [ ] **Caso 3.3 (KPIs de Agenda):** Verificar si los indicadores/KPIs de la agenda cambian de forma lógica al configurar la disponibilidad.

### 🔔 Bloque 4: Citas (Admin)
- [ ] **Caso 4.1 (Cita en Hueco Libre):** Reservar una cita en el horario disponible de `JUN12-Doctor-Valido` asignada al paciente `JUN12-Paciente-Valido`.
- [ ] **Caso 4.2 (Cita en Pasado):** Intentar agendar una cita para ayer o el mes pasado.
- [ ] **Caso 4.3 (Cita en Hueco Ocupado):** Intentar agendar una segunda cita a la misma hora exacta con el mismo doctor (doble reserva).

---

## 🐛 Control de Bugs Encontrados (Para volcar luego al Excel)

| ID Bug | Feature / Apartado | Pasos Rápidos | Qué pasó (Error) | Qué esperaba | Severidad |
|--------|--------------------|---------------|------------------|--------------|-----------|
| *ejemplo* | *Crear Paciente* | *1) Crear con email sin @* | *Guarda sin avisar* | *Alerta de email no válido* | *Grave* |
| | | | | | |
