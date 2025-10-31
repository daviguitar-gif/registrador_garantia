import React from 'react';

interface SummaryCardProps {
  totalOnus: number;
  percentualRespaldo: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ totalOnus, percentualRespaldo }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const percentage = isFinite(percentualRespaldo) && !isNaN(percentualRespaldo) ? percentualRespaldo : 0;
  const displayPercentage = (percentage * 100).toFixed(2);
  
  const getProgressBarColor = (p: number) => {
    if (p > 75) return 'bg-green-500';
    if (p > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Resultado da Análise</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-gray-600">Soma Total dos Ônus</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalOnus)}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-gray-600">Percentual de Respaldo</span>
            <span className="text-3xl font-bold text-gray-900">{displayPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor(parseFloat(displayPercentage))}`}
              style={{ width: `${Math.min(parseFloat(displayPercentage), 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">Avaliação / (Ônus + Risco Novo)</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;