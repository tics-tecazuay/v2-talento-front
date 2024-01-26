import React, { useState, useEffect } from "react";
import { VFiltrosService } from "../../services/VFiltros";
import { IFiltros } from "../../interfaces/Primary/VFiltros";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";
import { ReportBar } from "../../shared/ReportBar";

function Filtros() {
  const [filtrosData, setFiltrosData] = useState<IFiltros[]>([]);
  const [originalData, setOriginalData] = useState<IFiltros[]>([]);
  const [filters, setFilters] = useState({
    filtros_vigente: "",
    discapacidad: "",
    salario_publico: "",
    genero: "",
    fecha_inicio: null as Date | null,
    tiempo_dedicacion: "",
  });
  const [filteredData, setFilteredData] = useState<IFiltros[]>([]);
  const [selectedFechaInicio, setSelectedFechaInicio] = useState<Date | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [fechaFiltroTipo, setFechaFiltroTipo] = useState("");
  const vFiltrosService = new VFiltrosService();
  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);
  const getContratoVigenteText = (contrato_vigente: boolean) => {
    return contrato_vigente ? "Por terminar" : "Finalizado";
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const fetchData = async () => {
    try {
      const data = await vFiltrosService.getFiltros();
      setFiltrosData(data);
      setOriginalData(data);
      setIsLoading(false);
      loadExcelReportData(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  function loadExcelReportData(data: IFiltros[]) {
    const reportName = "Listado de Docentes";
    const rowData = data.map((item) => ({
      id_persona: item.id_persona,
      cedula: item.cedula,
      primer_nombre: item.primer_nombre,
      apellido_paterno: item.apellido_paterno,
      genero: item.genero,
      discapacidad: item.discapacidad,
      contrato_vigente: getContratoVigenteText(item.contrato_vigente),
      fecha_inicio: new Date(item.fecha_inicio!).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      fecha_fin: new Date(item.fecha_fin!).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      salario: item.salario,
      salario_publico: item.salario_publico,
      tiempo_dedicacion: item.tiempo_dedicacion,
    }));
    const headerItems: IHeaderItem[] = [
      { header: "NRO REGISTRO" },
      { header: "CÉDULA" },
      { header: "PRIMER NOMBRE" },
      { header: "APELLIDO PATERNO" },
      { header: "GÉNERO" },
      { header: "DISCAPACIDAD" },
      { header: "CONTRATO VIGENTE" },
      { header: "FECHA DE INICIO" },
      { header: "FECHA DE FIN" },
      { header: "SALARIO" },
      { header: "SALARIO PÚBLICO" },
      { header: "TIEMPO DEDICACIÓN" },
    ];
    setExcelReportData({
      reportName,
      headerItems,
      rowData,
    });
  }

  const applyFilters = () => {
    const filtered = originalData.filter((item) => {
      const fechaInicio = new Date(item.fecha_inicio);
      const filtrosNoVigente = !item.contrato_vigente;

      const filtroFechaInicio = filters.fecha_inicio
        ? new Date(filters.fecha_inicio)
        : null;

      fechaInicio.setUTCHours(0, 0, 0, 0);

      if (filtroFechaInicio) {
        filtroFechaInicio.setUTCHours(0, 0, 0, 0);
      }

      const diferenciaAnios = Math.abs(
        new Date().getFullYear() - fechaInicio.getFullYear()
      );

      return (
        (filters.filtros_vigente === "" ||
          (filters.filtros_vigente === "SI" && !filtrosNoVigente) ||
          (filters.filtros_vigente === "NO" && filtrosNoVigente)) &&
        (filters.discapacidad === "" ||
          item.discapacidad === filters.discapacidad) &&
        (filters.salario_publico === "" ||
          item.salario_publico === filters.salario_publico) &&
        (filters.genero === "" || item.genero === filters.genero) &&
        (filters.tiempo_dedicacion === "" ||
          item.tiempo_dedicacion === filters.tiempo_dedicacion) &&
        (!filters.fecha_inicio ||
          (filtroFechaInicio &&
            fechaInicio.getTime() === filtroFechaInicio.getTime())) &&
        (!filters.fecha_inicio ||
          (fechaFiltroTipo === "mayor" && diferenciaAnios > 5) ||
          (fechaFiltroTipo === "menor" &&
            filtroFechaInicio &&
            fechaInicio.getTime() > filtroFechaInicio.getTime()) ||
          fechaFiltroTipo === "")
      );
    });

    setFilteredData(filtered);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const dataToDisplay =
    filters.filtros_vigente ||
    filters.discapacidad ||
    filters.salario_publico ||
    filters.genero ||
    filters.tiempo_dedicacion ||
    filters.fecha_inicio
      ? filteredData
      : filtrosData;

  return (
    <Card
      header={cardHeader}
      className="border-solid border-blue-800 border-3 flex-1 w-full h-full flex-wrap"
    >
      <div className="h1-rem">
        <Divider align="center">
          <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
            Listado Docente
          </h1>
        </Divider>
      </div>
      <div style={{ marginLeft: "91.5%" , marginBottom: "5px"}}>
        <Button
          className="flex"
          label="Borrar Filtros"
          onClick={() => {
            setSelectedFechaInicio(null);
            setFilters({
              filtros_vigente: "",
              discapacidad: "",
              salario_publico: "",
              genero: "",
              fecha_inicio: null,
              tiempo_dedicacion: "",
            });
          }}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <div className="flex">
          <label>Contraro Vigente:</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={filters.filtros_vigente}
            style={{ width: "100px", height: "40px" }}
            onChange={(e) =>
              setFilters({ ...filters, filtros_vigente: e.value })
            }
            options={[
              { label: "Todos", value: "" },
              { label: "Si", value: "SI" },
              { label: "No", value: "NO" },
            ]}
          />
        </div>
        <div className="flex">
          <label>Discapacidad:</label>
          <InputText
            value={filters.discapacidad}
            style={{ width: "200px", height: "40px", fontSize: "15px" }}
            onChange={(e) =>
              setFilters({ ...filters, discapacidad: e.target.value })
            }
            placeholder="Filtrar por Discapacidad"
          />
        </div>
        <div className="flex">
          <label>Salario Público:</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={filters.salario_publico}
            onChange={(e) =>
              setFilters({ ...filters, salario_publico: e.value })
            }
            options={[
              { label: "Todos", value: "" },
              { label: "SP1", value: "SP1" },
              { label: "SP2", value: "SP2" },
              { label: "SP3", value: "SP3" },
              { label: "SP4", value: "SP4" },
              { label: "SP5", value: "SP5" },
              { label: "SP6", value: "SP6" },
              { label: "NJS1", value: "NJS1" },
              { label: "NJS2", value: "NJS2" },
            ]}
            placeholder="Seleccionar SP"
            style={{ width: "100px", height: "40px" }}
          />
        </div>
        <div className="flex">
          <label>Género:</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={filters.genero}
            onChange={(e) => setFilters({ ...filters, genero: e.value })}
            options={[
              { label: "Todos", value: "" },
              { label: "MASCULINO", value: "MASCULINO" },
              { label: "FEMENINO", value: "FEMENINO" },
              { label: "LGBTI+", value: "LGBTI+" },
            ]}
            placeholder="Filtrar por Género"
            style={{ marginLeft: "5px" }}
          />
        </div>
        <div className="flex">
          <label>Dedicacion de Tiempo:</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={filters.tiempo_dedicacion}
            onChange={(e) =>
              setFilters({ ...filters, tiempo_dedicacion: e.value })
            }
            options={[
              { label: "Todos", value: "" },
              { label: "Tiempo Completo", value: "Tiempo Completo" },
              { label: "Medio Tiempo", value: "Medio Tiempo" },
            ]}
            placeholder="Filtrar por Tiempo"
            style={{ marginLeft: "5px" }}
          />
        </div>
        <div className="flex">
          <label>Fecha de Inicio:</label>
          <Calendar
            name="fechaInicio"
            value={selectedFechaInicio}
            onChange={(e) => {
              setSelectedFechaInicio(e.value as Date | null);
              setFilters({ ...filters, fecha_inicio: e.value as Date | null });
            }}
            placeholder="Filtrar por Fecha de Inicio"
            dateFormat="yy-mm-dd"
          />
        </div>
      </div>
      <ReportBar
        reportName={excelReportData?.reportName!}
        headerItems={excelReportData?.headerItems!}
        rowData={excelReportData?.rowData!}
      />
      <table
        style={{ minWidth: "40rem" }}
        className="mt-4  w-full h-full text-3xl font-large"
      >
        <thead>
          <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
            <th>ID Persona</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Genero </th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Salario</th>
            <th>Salario Público </th>
            <th>Contrato</th>
            <th>Tiempo Dedicación</th>
            <th>Discapacidad </th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay.map((filtros) => (
            <tr className="text-center" key={filtros.id_persona?.toString()}>
              <td>{filtros.id_persona}</td>
              <td>
                {filtros.primer_nombre && filtros.apellido_paterno
                  ? `${filtros.primer_nombre} ${filtros.apellido_paterno}`
                  : "N/A"}
              </td>
              <td>{filtros.cedula ? filtros.cedula : "N/A"}</td>
              <td>{filtros.genero ? filtros.genero : "N/A"}</td>
              <td>{filtros.fecha_inicio}</td>
              <td>
                {filtros.fecha_fin ? filtros.fecha_fin : "Contrato Vigente"}
              </td>
              <td>{filtros.salario ? filtros.salario : "N/A"}</td>
              <td>
                {filtros.salario_publico ? filtros.salario_publico : "N/A"}
              </td>
              <td>{getContratoVigenteText(filtros.contrato_vigente)}</td>
              <td>
                {filtros.tiempo_dedicacion ? filtros.tiempo_dedicacion : "N/A"}
              </td>
              <td>{filtros.discapacidad ? filtros.discapacidad : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default Filtros;
