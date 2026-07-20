/**
 * LocalStorage-backed CRUD service.
 * Each entity (patients, doctors, appointments, invoices, staff) gets its own
 * collection. The service exposes a uniform interface so the modules look
 * identical from the consumer's side. Replace with real fetch() calls when
 * the backend is ready.
 */

import { STORAGE_KEYS, storage } from '../utils/storage';
import { sleep } from '../utils/helpers';

const KEYS = {
  patients: 'subhan_care.patients',
  doctors: 'subhan_care.doctors',
  appointments: 'subhan_care.appointments',
  invoices: 'subhan_care.invoices',
  staff: 'subhan_care.staff',
  prescriptions: 'subhan_care.prescriptions',
  inventory: 'subhan_care.inventory',
  medicalHistory: 'subhan_care.medical_history',
};

export const ENTITIES = Object.freeze({
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  INVOICES: 'invoices',
  STAFF: 'staff',
  PRESCRIPTIONS: 'prescriptions',
  INVENTORY: 'inventory',
  MEDICAL_HISTORY: 'medicalHistory',
});

const readCollection = (entity) => storage.get(KEYS[entity], []) || [];

const writeCollection = (entity, collection) => {
  storage.set(KEYS[entity], collection);
};

const generateId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

const seedNow = () => new Date().toISOString();

export const dataService = {
  list(entity) {
    return readCollection(entity);
  },
  find(entity, id) {
    return readCollection(entity).find((item) => item.id === id) || null;
  },
  async create(entity, payload) {
    await sleep(280);
    const collection = readCollection(entity);
    const record = {
      id: payload.id || generateId(entity.slice(0, 3).toUpperCase()),
      createdAt: seedNow(),
      updatedAt: seedNow(),
      ...payload,
    };
    writeCollection(entity, [record, ...collection]);
    return record;
  },
  async update(entity, id, patch) {
    await sleep(220);
    const collection = readCollection(entity);
    let updated = null;
    const next = collection.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...patch, updatedAt: seedNow() };
      return updated;
    });
    writeCollection(entity, next);
    if (!updated) {
      const error = new Error(`${entity} record not found: ${id}`);
      error.code = 'NOT_FOUND';
      throw error;
    }
    return updated;
  },
  async remove(entity, id) {
    await sleep(200);
    const collection = readCollection(entity);
    const next = collection.filter((item) => item.id !== id);
    writeCollection(entity, next);
    return { success: true };
  },
  async replaceAll(entity, collection) {
    await sleep(150);
    writeCollection(entity, collection);
    return collection;
  },
  reset(entity) {
    writeCollection(entity, []);
  },
};

export const ID = generateId;