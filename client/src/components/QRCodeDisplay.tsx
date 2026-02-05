import React from 'react';
import QRCode from 'qrcode';
import { X, Smartphone } from 'lucide-react';

interface QRCodeDisplayProps {
  qrCode: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode }) => {
  const [qrImage, setQrImage] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(qrCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrImage(url);
        setError('');
      } catch (err) {
        setError('Failed to generate QR code');
        console.error('QR Code generation error:', err);
      }
    };

    generateQR();
  }, [qrCode]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Conectar WhatsApp</h3>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Escaneie este QR Code com o WhatsApp no seu celular para conectar:
        </p>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
            {qrImage ? (
              <img 
                src={qrImage} 
                alt="WhatsApp QR Code" 
                className="w-64 h-64"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>1. Abra o WhatsApp no seu celular</p>
          <p>2. Toque em Menu > Dispositivos conectados</p>
          <p>3. Toque em "Conectar um dispositivo"</p>
          <p>4. Aponte a câmera para este QR Code</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
