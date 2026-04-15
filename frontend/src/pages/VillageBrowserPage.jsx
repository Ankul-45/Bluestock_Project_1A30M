import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { stateDirectory, villages as fallbackVillages } from "../data/mockData";
import { browseVillages, getDistrictsByState, getStates, getSubDistrictsByDistrict } from "../services/api";

const pageSizeOptions = [500, 5000, 10000];

export default function VillageBrowserPage() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [subDistrictId, setSubDistrictId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [fromMock, setFromMock] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let active = true;
    getStates()
      .then((result) => {
        if (!active) return;
        setStates(result);
        setFromMock(false);
      })
      .catch(() => {
        if (!active) return;
        setStates(stateDirectory.map((state) => ({ id: state.id, name: state.name })));
        setFromMock(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setDistricts([]);
    setDistrictId("");
    setSubDistricts([]);
    setSubDistrictId("");
    setRows([]);
    setPage(1);

    if (!stateId) return;

    if (fromMock) {
      const state = stateDirectory.find((item) => String(item.id) === String(stateId));
      setDistricts(state?.districts.map((district) => ({ id: district.id, name: district.name })) || []);
      return;
    }

    getDistrictsByState(stateId)
      .then(setDistricts)
      .catch(() => setDistricts([]));
  }, [fromMock, stateId]);

  useEffect(() => {
    setSubDistricts([]);
    setSubDistrictId("");
    setRows([]);
    setPage(1);

    if (!districtId) return;

    if (fromMock) {
      const district = stateDirectory.flatMap((state) => state.districts).find((item) => String(item.id) === String(districtId));
      setSubDistricts(district?.subDistricts.map((subDistrict) => ({ id: subDistrict.id, name: subDistrict.name })) || []);
      return;
    }

    getSubDistrictsByDistrict(districtId)
      .then(setSubDistricts)
      .catch(() => setSubDistricts([]));
  }, [districtId, fromMock]);

  useEffect(() => {
    if (!stateId) {
      setRows([]);
      setTotalCount(0);
      return;
    }

    if (fromMock) {
      const selectedState = states.find((item) => String(item.id) === String(stateId));
      const selectedDistrict = districts.find((item) => String(item.id) === String(districtId));
      const selectedSubDistrict = subDistricts.find((item) => String(item.id) === String(subDistrictId));
      const q = search.trim().toLowerCase();

      const filtered = fallbackVillages.filter((row) => {
        const byState = !selectedState || row.stateName === selectedState.name;
        const byDistrict = !selectedDistrict || row.districtName === selectedDistrict.name;
        const bySubDistrict = !selectedSubDistrict || row.subDistrictName === selectedSubDistrict.name;
        const bySearch = !q || row.villageName.toLowerCase().includes(q);
        return byState && byDistrict && bySubDistrict && bySearch;
      });

      setTotalCount(filtered.length);
      setRows(
        filtered.slice((page - 1) * pageSize, page * pageSize).map((row) => ({
          state_name: row.stateName,
          district_name: row.districtName,
          sub_district_name: row.subDistrictName,
          village_code: row.villageCode,
          village_name: row.villageName,
        })),
      );
      return;
    }

    browseVillages({
      state_id: stateId,
      district_id: districtId,
      sub_district_id: subDistrictId,
      search,
      page,
      limit: pageSize,
    })
      .then((result) => {
        setRows(result.rows || []);
        setTotalCount(result.total || 0);
      })
      .catch(() => {
        setRows([]);
        setTotalCount(0);
      });
  }, [districtId, fromMock, page, pageSize, search, stateId, states, districts, subDistrictId, subDistricts]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize, stateId, districtId, subDistrictId]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize]);

  return (
    <AppShell portal="admin" title="Village Master List (Data Browser)">
      <section className="panel">
        <h3>Purpose: Explore and Verify Imported Data</h3>
        <div className="controls-grid four">
          <select value={stateId} onChange={(event) => setStateId(event.target.value)}>
            <option value="">Select state (required)</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>

          <select value={districtId} onChange={(event) => setDistrictId(event.target.value)} disabled={!stateId}>
            <option value="">Select district</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>

          <select value={subDistrictId} onChange={(event) => setSubDistrictId(event.target.value)} disabled={!districtId}>
            <option value="">Select sub-district</option>
            {subDistricts.map((subDistrict) => (
              <option key={subDistrict.id} value={subDistrict.id}>
                {subDistrict.name}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Village name search (partial match)"
          />
        </div>

        <div className="pagination-row">
          <label>
            Page size
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Jump to page
            <input
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={(event) => setPage(Math.max(1, Math.min(totalPages, Number(event.target.value) || 1)))}
            />
          </label>
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))}>
            Previous
          </button>
          <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
            Next
          </button>
          <span className="chip">Total records: {totalCount}</span>
          {fromMock && <span className="chip">Mock mode active</span>}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>State Name</th>
                <th>District Name</th>
                <th>Sub-District Name</th>
                <th>Village Code</th>
                <th>Village Name</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.village_code}-${row.village_name}`}>
                  <td>{row.state_name}</td>
                  <td>{row.district_name}</td>
                  <td>{row.sub_district_name}</td>
                  <td>{row.village_code || "-"}</td>
                  <td>{row.village_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
