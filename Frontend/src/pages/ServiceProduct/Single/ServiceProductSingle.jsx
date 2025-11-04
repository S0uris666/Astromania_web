import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ServiceProductContext from "../../../context/serviceProducts/ServiceProductContext";
import { UserContext } from "../../../context/user/UserContext";
import { ServiceProductGallery } from "./components/Gallery";
import { BreadcrumbsTrail } from "./components/BreadcrumbsTrail";
import { InfoBadges } from "./components/InfoBadges";
import { ActionButtons } from "./components/ActionButtons";
import { LinksList } from "./components/LinksList";
import { TagList } from "./components/TagList";
import { MetadataGrid } from "./components/MetadataGrid";
import {
  TYPE_LABEL,
  buildBreadcrumbs,
  formatPrice,
  normalizeImages,
  normalizeLinks,
} from "./serviceProduct.helpers";

export const ServiceProductSingle = () => {
  const { slug: param } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(UserContext);
  const { serviceProduct = [], getSP } = useContext(ServiceProductContext);

  const initialFromRoute = location?.state?.serviceProduct || null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(!initialFromRoute);

  useEffect(() => {
    let mounted = true;

    if (initialFromRoute) {
      setLoading(false);
      return () => {};
    }

    (async () => {
      try {
        await getSP();
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [initialFromRoute, getSP]);

  const normalizedParam = useMemo(() => {
    try {
      return decodeURIComponent(param ?? "");
    } catch {
      return param ?? "";
    }
  }, [param]);

  const item = useMemo(() => {
    if (initialFromRoute) return initialFromRoute;
    if (!serviceProduct?.length) return null;

    return (
      serviceProduct.find((entry) => entry.slug === normalizedParam) ||
      serviceProduct.find(
        (entry) => String(entry._id || entry.id) === String(normalizedParam),
      ) ||
      null
    );
  }, [initialFromRoute, serviceProduct, normalizedParam]);

  const itemId = useMemo(() => (item?._id || item?.id ? String(item._id || item.id) : null), [item]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [itemId]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="animate-pulse rounded-3xl border border-base-300/60 bg-base-100/80 shadow-inner">
            <div className="h-[480px] w-full rounded-3xl bg-base-300/40" />
          </div>
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-base-300/50" />
            <div className="h-8 w-3/4 rounded bg-base-300/60" />
            <div className="h-4 w-full rounded bg-base-300/50" />
            <div className="h-4 w-5/6 rounded bg-base-300/40" />
            <div className="h-36 rounded-3xl border border-base-300/50 bg-base-300/30" />
          </div>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 rounded-3xl border border-base-300/60 bg-base-100/95 p-12 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-base-content">No encontramos este elemento</h2>
          <p className="text-sm text-base-content/70">
            Puede que se haya movido o ya no este disponible. Regresa al catalogo para seguir explorando.
          </p>
          <Link to="/servicios-productos-list" className="btn btn-primary">
            Volver al catalogo
          </Link>
        </div>
      </section>
    );
  }

  const type = String(item.type || "").toLowerCase();
  const isProduct = type === "product";
  const isService = type === "service";
  const isActivity = type === "activity";

  const images = normalizeImages(item);
  const links = normalizeLinks(item.links || []);
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const serviceLocations = Array.isArray(item.locations) ? item.locations : [];

  const hasStock = isProduct && typeof item.stock === "number" ? item.stock > 0 : false;
  const typeLabel = TYPE_LABEL[type] || type;
  const breadcrumbs = buildBreadcrumbs(item.title);
  const priceLabel = formatPrice(item.price);

  const handleAddToCart = () => addToCart(item);
  const handleBack = () => navigate(-1);
  const cardClass = "rounded-3xl border border-base-300/60 bg-base-100/95 shadow-sm";

  return (
    <section className="relative min-h-screen bg-base-200">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-300/30 to-base-200" />
        <div className="absolute -top-32 -right-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <BreadcrumbsTrail items={breadcrumbs} />

        <header className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-100 shadow-lg">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.18),transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.4))]" />
          <div className="relative grid gap-6 px-6 py-8 text-white sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="space-y-4">
              <InfoBadges
                typeLabel={typeLabel}
                isProduct={isProduct}
                stock={typeof item.stock === "number" ? item.stock : 0}
                hasStock={hasStock}
                isService={isService}
                durationMinutes={item.durationMinutes}
                capacity={item.capacity}
                isActivity={isActivity}
                location={item.location}
                isActive={item.active}
              />
              <div className="space-y-3">
                <h1 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">{item.title}</h1>
                {item.shortDescription ? (
                  <p className="max-w-2xl text-sm sm:text-base text-white/80">{item.shortDescription}</p>
                ) : null}
              </div>
              <TagList tags={tags} />
            </div>

            <ActionButtons
              isProduct={isProduct}
              priceLabel={priceLabel}
              hasStock={hasStock}
              onAddToCart={handleAddToCart}
              onBack={handleBack}
              className="bg-white/10 border-white/20 text-white shadow-none backdrop-blur"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <ServiceProductGallery images={images} selectedIndex={selectedIndex} onSelectImage={setSelectedIndex} />

          <div className="space-y-6">
            {item.description ? (
              <div className={`${cardClass} p-6`}>
                <h2 className="text-base font-semibold text-base-content/80">Descripcion</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-base-content/80">
                  {item.description}
                </p>
              </div>
            ) : null}

            <LinksList links={links} className={cardClass} />
            <MetadataGrid
              category={item.category}
              delivery={item.delivery}
              locations={serviceLocations}
              isProduct={isProduct}
              isService={isService}
              className={cardClass}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
