import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  id: string;
  titulo: string;
  srcImg: string;
  precio: string;
  lugar: string;
  categoria: string;
}

export function EventCard({ id, titulo, srcImg, precio, lugar, categoria }: EventCardProps) {
  const navigate = useNavigate();

  const handleComprar = () => {
    navigate(`/checkout?eventId=${id}`);
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant/20 hover:shadow-lg transition">
      <img
        src={srcImg}
        alt={titulo}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-on-surface mb-2">{titulo}</h3>
        <p className="text-on-surface/70 text-sm mb-4">{lugar}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-primary font-bold text-lg">{precio}</span>
          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
            {categoria}
          </span>
        </div>
        <button
          onClick={handleComprar}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          Comprar Ahora
        </button>
      </div>
    </div>
  );
}