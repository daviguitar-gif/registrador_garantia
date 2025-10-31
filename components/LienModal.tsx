import React, { useState, useEffect } from 'react';
import { Onus, OnusType } from '../types';
import Button from './Button';
import Input from './Input';
import { CloseIcon } from './icons';

interface LienModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (onus: Onus) => void;
  lienToEdit: Onus | null;
}

const formatNumber = (value: number): string => {
    if (isNaN(value)) return '0,00';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const LienModal: React.FC<LienModalProps> = ({ isOpen, onClose, onSave, lienToEdit }) => {
  const getInitialFormData = (): Omit<Onus, 'id'> => ({
    grau: '1º Grau',
    tipo: OnusType.ALIENACAO,
    emissao: '',
    vencimento: '',
    instituicao: '',
    valor: 0,
  });

  const [formData, setFormData] = useState<Omit<Onus, 'id'>>(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
        if (lienToEdit) {
          setFormData({
            grau: lienToEdit.grau,
            tipo: lienToEdit.tipo,
            emissao: lienToEdit.emissao,
            vencimento: lienToEdit.vencimento,
            instituicao: lienToEdit.instituicao,
            valor: lienToEdit.valor,
          });
        } else {
          setFormData(getInitialFormData());
        }
    }
  }, [lienToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     if (name === 'valor') {
      const digitsOnly = value.replace(/\D/g, '');
      const numberValue = digitsOnly === '' ? 0 : Number(digitsOnly) / 100;
      setFormData(prev => ({ ...prev, valor: numberValue }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    const newLien: Onus = {
      id: lienToEdit?.id || Date.now(),
      ...formData,
    };
    onSave(newLien);
  };

  if (!isOpen) return null;

  const grauOptions = Array.from({ length: 100 }, (_, i) => `${i + 1}º Grau`);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
            <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{lienToEdit ? 'Editar Ônus' : 'Adicionar Novo Ônus'}</h2>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="grau" className="block text-sm font-medium text-gray-700 mb-1">Grau</label>
                    <select id="grau" name="grau" value={formData.grau} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                        {grauOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ônus</label>
                    <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                        <option value={OnusType.ALIENACAO}>{OnusType.ALIENACAO}</option>
                        <option value={OnusType.HIPOTECA}>{OnusType.HIPOTECA}</option>
                    </select>
                </div>
            </div>
          <Input label="Instituição (Banco)" id="instituicao" name="instituicao" value={formData.instituicao} onChange={handleChange} placeholder="Ex: Banco X" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Data de Emissão" id="emissao" name="emissao" type="date" value={formData.emissao} onChange={handleChange} />
            <Input label="Data de Vencimento" id="vencimento" name="vencimento" type="date" value={formData.vencimento} onChange={handleChange} />
          </div>
          <Input label="Valor do Ônus (R$)" id="valor" name="valor" type="text" value={formatNumber(formData.valor)} onChange={handleChange} placeholder="5.000.000,00" />
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave} variant="primary">Salvar</Button>
        </div>
      </div>
    </div>
  );
};

export default LienModal;