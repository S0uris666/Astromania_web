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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(!initialFromRoute);

  useEffect(() => {
    let mounted = true;

    if (initialFromRoute) {
      setLoading(false);
    } else {
      (async () => {
        try {
          await getSP();
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    }

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
        (entry) => String(entry._id || entry.id) === String(normalizedParam)
      ) ||
      null
    );
  }, [initialFromRoute, serviceProduct, normalizedParam]);

  const itemId = useMemo(
    () => (item?._id || item?.id ? String(item._id || item.id) : null),
    [item]
  );

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [itemId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mt-15 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="rounded-2xl border border-base-300 bg-base-200 h-[480px] animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-base-200 rounded" />
            <div className="h-4 w-3/4 bg-base-200 rounded" />
            <div className="h-4 w-1/2 bg-base-200 rounded" />
            <div className="h-10 w-40 bg-base-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="opacity-70">No encontramos este elemento.</p>
        <Link to="/servicios-productos-list" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
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

  const hasStock =
    isProduct && typeof item.stock === "number" ? item.stock > 0 : false;
  const typeLabel = TYPE_LABEL[type] || type;
  const breadcrumbs = buildBreadcrumbs(item.title);
  const priceLabel = formatPrice(item.price);

  const handleAddToCart = () => addToCart(item);
  const handleBack = () => navigate(-1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <BreadcrumbsTrail items={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10">
        <ServiceProductGallery
          images={images}
          selectedIndex={selectedImageIndex}
          onSelectImage={setSelectedImageIndex}
        />

        <section className="space-y-6">
          <header className="space-y-3">
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

            <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>

            {item.shortDescription ? (
              <p className="text-base text-base-content/80 leading-relaxed">
                {item.shortDescription}
              </p>
            ) : null}
          </header>

          {item.description ? (
            <div className="prose prose-sm max-w-none text-base-content/90 whitespace-pre-line">
              {item.description}
            </div>
          ) : null}

          <LinksList links={links} />
          <TagList tags={tags} />

          <ActionButtons
            isProduct={isProduct}
            priceLabel={priceLabel}
            hasStock={hasStock}
            onAddToCart={handleAddToCart}
            onBack={handleBack}
          />

          <MetadataGrid
            category={item.category}
            delivery={item.delivery}
            locations={serviceLocations}
            isProduct={isProduct}
            isService={isService}
          />
        </section>
      </div>
    </div>
  );
};





