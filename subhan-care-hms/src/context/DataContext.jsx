import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dataService, ENTITIES } from '../services/dataService';
import { seedIfEmpty } from '../services/seedData';

const DataContext = createContext(null);

const createEntityHook = (entity) => () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx[entity];
};

export const DataProvider = ({ children }) => {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);

  const refreshAll = useCallback(() => {
    setPatients(dataService.list(ENTITIES.PATIENTS));
    setDoctors(dataService.list(ENTITIES.DOCTORS));
    setAppointments(dataService.list(ENTITIES.APPOINTMENTS));
    setInvoices(dataService.list(ENTITIES.INVOICES));
    setStaff(dataService.list(ENTITIES.STAFF));
    setPrescriptions(dataService.list(ENTITIES.PRESCRIPTIONS));
    setInventory(dataService.list(ENTITIES.INVENTORY));
    setMedicalHistory(dataService.list(ENTITIES.MEDICAL_HISTORY));
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const wrap = useCallback(
    (entity, setter) => ({
      list: () => dataService.list(entity),
      find: (id) => dataService.find(entity, id),
      create: async (payload) => {
        const created = await dataService.create(entity, payload);
        refreshAll();
        return created;
      },
      update: async (id, patch) => {
        const updated = await dataService.update(entity, id, patch);
        refreshAll();
        return updated;
      },
      remove: async (id) => {
        const result = await dataService.remove(entity, id);
        refreshAll();
        return result;
      },
      replaceAll: async (collection) => {
        const next = await dataService.replaceAll(entity, collection);
        refreshAll();
        return next;
      },
      reset: () => {
        dataService.reset(entity);
        refreshAll();
      },
      state: setter,
    }),
    [refreshAll],
  );

  const value = useMemo(
    () => ({
      [ENTITIES.PATIENTS]: wrap(ENTITIES.PATIENTS, setPatients),
      [ENTITIES.DOCTORS]: wrap(ENTITIES.DOCTORS, setDoctors),
      [ENTITIES.APPOINTMENTS]: wrap(ENTITIES.APPOINTMENTS, setAppointments),
      [ENTITIES.INVOICES]: wrap(ENTITIES.INVOICES, setInvoices),
      [ENTITIES.STAFF]: wrap(ENTITIES.STAFF, setStaff),
      [ENTITIES.PRESCRIPTIONS]: wrap(ENTITIES.PRESCRIPTIONS, setPrescriptions),
      [ENTITIES.INVENTORY]: wrap(ENTITIES.INVENTORY, setInventory),
      [ENTITIES.MEDICAL_HISTORY]: wrap(ENTITIES.MEDICAL_HISTORY, setMedicalHistory),
      refresh: refreshAll,
    }),
    [wrap, refreshAll],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};

export const usePatients = createEntityHook(ENTITIES.PATIENTS);
export const useDoctors = createEntityHook(ENTITIES.DOCTORS);
export const useAppointments = createEntityHook(ENTITIES.APPOINTMENTS);
export const useInvoices = createEntityHook(ENTITIES.INVOICES);
export const useStaff = createEntityHook(ENTITIES.STAFF);
export const usePrescriptions = createEntityHook(ENTITIES.PRESCRIPTIONS);
export const useInventory = createEntityHook(ENTITIES.INVENTORY);
export const useMedicalHistory = createEntityHook(ENTITIES.MEDICAL_HISTORY);

export default DataContext;