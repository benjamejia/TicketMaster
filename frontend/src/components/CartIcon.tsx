import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CartIcon() {
    const { totalItems, items } = useCart();

    return (
        <Link
            to="/carrito"
            className="relative p-2 text-on-surface-variant hover:text-primary transition-colors"
        >
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                </span>
            )}

            {/* Dropdown preview */}
            <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {items.length === 0 ? (
                    <p className="p-4 text-sm text-on-surface-variant text-center">Tu carrito está vacío</p>
                ) : (
                    <div className="max-h-64 overflow-y-auto">
                        {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 border-b border-outline-variant/10">
                                <img src={item.srcImg} alt={item.titulo} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-on-background truncate">{item.titulo}</p>
                                    <p className="text-xs text-on-surface-variant">{item.cantidad} × ${item.precio.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                        {items.length > 3 && (
                            <p className="p-2 text-xs text-on-surface-variant text-center">+{items.length - 3} más...</p>
                        )}
                    </div>
                )}
                {items.length > 0 && (
                    <Link
                        to="/carrito"
                        className="block w-full text-center py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors rounded-b-2xl"
                    >
                        Ver carrito →
                    </Link>
                )}
            </div>
        </Link>
    );
}
