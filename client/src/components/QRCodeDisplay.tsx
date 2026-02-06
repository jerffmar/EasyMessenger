import React from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Loader2 } from 'lucide-react';

interface QRCodeDisplayProps {
  qrCode: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, onRefresh, isLoading = false }) => {
  const [qrImage, setQrImage] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      if (!qrCode || qrCode === 'pending') {
        setQrImage('');
        setError('');
        return;
      }

      try {
        const url = await QRCode.toDataURL(qrCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#10b981',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
        setQrImage(url);
        setError('');
      } catch (err) {
        setError('Falha ao gerar QR Code');
        console.error('QR Code generation error:', err);
      }
    };

    generateQR();
  }, [qrCode]);

  if (!qrCode || qrCode === 'pending') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-200">
            {isLoading ? (
              <Loader2 className="text-emerald-500 animate-spin" size={48} />
            ) : (
              <Smartphone className="text-slate-400" size={48} />
            )}
          </div>
          {!isLoading && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <span>●</span>
              <span>Aguardando conexão</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-xs">
          <div className="flex items-center space-x-2 text-red-600">
            <span>⚠</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative group">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
              {qrImage ? (
                <img 
                  src={qrImage} 
                  alt="WhatsApp QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-lg">
                  <Loader2 className="text-emerald-500 animate-spin" size={32} />
                </div>
              )}
            </div>
            
            {/* Refresh button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="absolute -top-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Atualizar QR Code"
              >
                <Loader2 size={16} />
              </button>
            )}

            {/* Animated scan line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 font-medium mb-2">Escaneie com WhatsApp</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>1. Abra o WhatsApp no celular</p>
              <p>2. Menu → Dispositivos conectados</p>
              <p>3. Conectar um dispositivo</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodeDisplay;
