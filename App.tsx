import React, { useState, useMemo } from 'react';
import { Onus, OnusType } from './types';
import Button from './components/Button';
import Input from './components/Input';
import LienModal from './components/LienModal';
import SummaryCard from './components/SummaryCard';
import { EditIcon, PlusIcon, TrashIcon, RefreshIcon, ClipboardIcon } from './components/icons';

const formatNumber = (value: number): string => {
    if (isNaN(value)) return '0,00';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const App: React.FC = () => {
  const getInitialState = () => ({
      matricula: '1234',
      valorAvaliacao: 10000000,
      valorRiscoNovo: 2000000,
      liens: [
        { id: 1, grau: '1º Grau', tipo: OnusType.HIPOTECA, emissao: '2020-01-15', vencimento: '2026-12-11', instituicao: 'Banco X', valor: 5000000 },
      ],
  });

  const [matricula, setMatricula] = useState(getInitialState().matricula);
  const [valorAvaliacao, setValorAvaliacao] = useState(getInitialState().valorAvaliacao);
  const [valorRiscoNovo, setValorRiscoNovo] = useState(getInitialState().valorRiscoNovo);
  const [liens, setLiens] = useState<Onus[]>(getInitialState().liens);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lienToEdit, setLienToEdit] = useState<Onus | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copiar Resumo');


  const totalOnus = useMemo(() => {
    return liens.reduce((acc, onus) => acc + onus.valor, 0);
  }, [liens]);

  const percentualRespaldo = useMemo(() => {
    const totalDebito = totalOnus + valorRiscoNovo;
    if (valorAvaliacao === 0 || totalDebito === 0) {
      return 0;
    }
    return valorAvaliacao / totalDebito;
  }, [valorAvaliacao, valorRiscoNovo, totalOnus]);

  const handleCurrencyChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly === '') {
        setter(0);
        return;
    }
    const numberValue = Number(digitsOnly) / 100;
    setter(numberValue);
  };

  const handleAddLien = () => {
    setLienToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditLien = (onus: Onus) => {
    setLienToEdit(onus);
    setIsModalOpen(true);
  };

  const handleDeleteLien = (id: number) => {
    setLiens(liens.filter(onus => onus.id !== id));
  };
  
  const handleSaveLien = (onus: Onus) => {
    const index = liens.findIndex(o => o.id === onus.id);
    if (index > -1) {
      const updatedLiens = [...liens];
      updatedLiens[index] = onus;
      setLiens(updatedLiens);
    } else {
      setLiens([...liens, onus]);
    }
    setIsModalOpen(false);
  };
  
  const handleClearAnalysis = () => {
    setMatricula('');
    setValorAvaliacao(0);
    setValorRiscoNovo(0);
    setLiens([]);
  };
  
  const handleCopyList = () => {
    const headerLines = [
        `Ônus Ativos Sob a Matrícula: ${matricula}`,
        `Valor Avaliação: ${formatCurrency(valorAvaliacao)}`,
        `Respaldo Sob o Risco: ${(percentualRespaldo * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
    ];

    const listContent = liens.map(onus => 
        `${onus.grau} - Tipo: ${onus.tipo}; ${onus.instituicao} - Emissão em ${formatDate(onus.emissao)}, Vencimento em ${formatDate(onus.vencimento)}, Valor ${formatCurrency(onus.valor)};`
    ).join('\n');

    const fullText = headerLines.join('\n') + '\n' + listContent;

    navigator.clipboard.writeText(fullText).then(() => {
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar Resumo'), 2000);
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center relative">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Analisador de Garantias de Crédito
          </h1>
          <p className="text-gray-600 mt-2">Uma ferramenta para avaliação de propostas de crédito imobiliário.</p>
           <div className="absolute top-0 right-0">
               <Button onClick={handleClearAnalysis} variant="secondary"><RefreshIcon /> Limpar Análise</Button>
           </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Imóvel</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Matrícula do Imóvel" id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                <Input label="Valor de Avaliação (R$)" id="valorAvaliacao" type="text" value={formatNumber(valorAvaliacao)} onChange={handleCurrencyChange(setValorAvaliacao)} />
                <Input label="Valor do Risco Novo (R$)" id="valorRiscoNovo" type="text" value={formatNumber(valorRiscoNovo)} onChange={handleCurrencyChange(setValorRiscoNovo)} />
              </div>
            </section>
            
            <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Ônus da Matrícula</h2>
                <Button onClick={handleAddLien}><PlusIcon/> Adicionar Ônus</Button>
              </div>
              <div className="overflow-x-auto">
                {liens.length > 0 ? (
                    <>
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 text-sm text-gray-500">
                                <tr>
                                    <th className="p-3 font-semibold">Grau</th>
                                    <th className="p-3 font-semibold">Tipo</th>
                                    <th className="p-3 font-semibold">Instituição</th>
                                    <th className="p-3 font-semibold">Emissão</th>
                                    <th className="p-3 font-semibold">Vencimento</th>
                                    <th className="p-3 font-semibold text-right">Valor</th>
                                    <th className="p-3 font-semibold text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {liens.map(onus => (
                                    <tr key={onus.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3">{onus.grau}</td>
                                        <td className="p-3">{onus.tipo}</td>
                                        <td className="p-3">{onus.instituicao}</td>
                                        <td className="p-3">{formatDate(onus.emissao)}</td>
                                        <td className="p-3">{formatDate(onus.vencimento)}</td>
                                        <td className="p-3 text-right font-medium text-gray-700">{formatCurrency(onus.valor)}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={() => handleEditLien(onus)} className="p-2 text-blue-500 hover:text-blue-700 transition rounded-full hover:bg-blue-100"><EditIcon/></button>
                                                <button onClick={() => handleDeleteLien(onus.id)} className="p-2 text-red-500 hover:text-red-700 transition rounded-full hover:bg-red-100"><TrashIcon/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleCopyList} variant="secondary"><ClipboardIcon /> {copyButtonText}</Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>Nenhum ônus adicionado.</p>
                        <p className="text-sm mt-1">Clique em "Adicionar Ônus" para começar.</p>
                    </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-8">
                <SummaryCard totalOnus={totalOnus} percentualRespaldo={percentualRespaldo} />
             </div>
          </div>
        </main>
      </div>
      <LienModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLien} lienToEdit={lienToEdit} />
    </div>
  );
};

export default App;