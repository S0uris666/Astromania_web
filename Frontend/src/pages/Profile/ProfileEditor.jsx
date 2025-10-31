import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { UserContext } from "../../context/user/UserContext";
import ProfileForm from "./components/ProfileForm";
import SocialLinksEditor from "./components/SocialLinksEditor";
import ProfileImageUploader from "./components/ProfileImageUploader";
import { normalizeText, parseSpecializations, getLinkLabel } from "./profileUtils.js";

const EMPTY_PROFILE = {
  username: "",
  profesion: "",
  especializacion: "",
  description: "",
  email: "",
  status: "draft",
  city: "",
};

const ProfilePreviewCard = ({
  profile,
  specializationList,
  previewImage,
  links,
}) => {
  const displayName = normalizeText(profile.username) || "Tu nombre";
  const profession = normalizeText(profile.profesion) || "Profesion o rol";
  const city = normalizeText(profile.city);
  const email = normalizeText(profile.email);
  const status = normalizeText(profile.status);
  const isPublished = status === "published";
/*   const statusLabel = isPublished ? "Publicado" : "Borrador";
  const statusBadge = isPublished ? "badge-success" : "badge-ghost"; */
  const description =
    normalizeText(profile.description) ||
    "Usa el formulario para compartir tu experiencia e intereses como divulgador.";
  const condensedDescription =
    description.length > 260 ? `${description.slice(0, 257)}...` : description;

  const activeLinks = links.filter((link) => normalizeText(link.url));

  return (
    <div className="card bg-base-200 shadow-md lg:sticky lg:top-24  ">
      {previewImage ? (
        <figure className="aspect-[4/3] overflow-hidden bg-base-100">
          <img
            src={previewImage}
            alt={`Imagen de ${displayName}`}
            className="h-full w-full object-cover"
          />
        </figure>
      ) : (
        <div className="aspect-[4/3] flex items-center justify-center bg-base-300 text-base-content/70">
          <span className="text-sm">Tu foto se mostrara aqui</span>
        </div>
      )}

      <div className="card-body space-y-4">
        <div>
          <h2 className="card-title text-xl">{displayName}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-base-content/70">
              {profession}
              {city ? ` | ${city}` : ""}
            </p>
            
          </div>
        </div>

        {specializationList.length ? (
          <div className="flex flex-wrap gap-2">
            {specializationList.map((item, index) => (
              <span key={`${item}-${index}`} className="badge badge-outline">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {email ? (
          <p className="text-sm">
            <span className="font-semibold">Correo:</span>{" "}
            <a href={`mailto:${email}`} className="link link-primary break-all">
              {email}
            </a>
          </p>
        ) : null}

        <p className="text-sm leading-relaxed">{condensedDescription}</p>

        {activeLinks.length ? (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Enlaces
            </p>
            <div className="flex flex-wrap gap-2">
              {activeLinks.map((link, index) => {
                const label = getLinkLabel(link.label, link.url);
                return (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-outline hover:badge-primary"
                  >
                    {label || "Enlace"}
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}

        {!isPublished && (
          <p className="text-xs text-warning">
            Mientras tu perfil este en borrador no aparecera en la comunidad.
          </p>
        )}
      </div>
    </div>
  );
};

const ProfileEditor = () => {
  const { currentUser, verifyUser, updateUser } = useContext(UserContext);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [links, setLinks] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const hasRequestedUser = useRef(false);

  useEffect(() => {
    if (hasRequestedUser.current) {
      return;
    }
    hasRequestedUser.current = true;

    let cancelled = false;

    verifyUser().catch(() => {
      if (!cancelled) {
        setStatus({
          type: "error",
          message: "No se pudo obtener la informacion del usuario.",
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [verifyUser]);

  useEffect(() => {
    if (!currentUser) return;
    const {
      username,
      profesion,
      especializacion,
      description,
      links: userLinks,
      images,
      city,
      email,
      status,
    } = currentUser;

    setProfile({
      username: username || "",
      profesion: profesion || "",
      especializacion:
        typeof especializacion === "string"
          ? especializacion
          : JSON.stringify(especializacion ?? ""),
      description: description || "",
      email: email || "",
      status:
        status === "published" || status === "draft" ? status : "draft",
      city: city || "",
    });
    setLinks(
      Array.isArray(userLinks)
        ? userLinks.map((link) => ({
            label: link?.label || "",
            url: link?.url || "",
          }))
        : []
    );
    setExistingImages(Array.isArray(images) ? images : []);
    setRemoveImageIds([]);
    setNewFiles([]);
  }, [currentUser]);

  useEffect(() => {
    let objectUrl;
    if (
      newFiles.length &&
      typeof window !== "undefined" &&
      typeof URL?.createObjectURL === "function"
    ) {
      objectUrl = URL.createObjectURL(newFiles[0]);
      setPreviewImage(objectUrl);
    } else {
      const existing = existingImages.find((image) => image?.url);
      setPreviewImage(existing?.url || "");
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [existingImages, newFiles]);

  const specializationList = useMemo(
    () => parseSpecializations(profile.especializacion),
    [profile.especializacion]
  );

  const previewLinks = useMemo(
    () =>
      links
        .map((link) => ({
          label: link?.label || "",
          url: link?.url || "",
        }))
        .filter((link) => normalizeText(link.url)),
    [links]
  );

  const handleFieldChange = (name, value) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveExisting = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((image) => image.public_id !== publicId)
    );
    setRemoveImageIds((prev) =>
      prev.includes(publicId) ? prev : [...prev, publicId]
    );
  };

  const handleAddFiles = (files) => {
    const fileArray = Array.from(files || []).filter(
      (file) => file instanceof File
    );
    if (!fileArray.length) return;
    setNewFiles((prev) => [...prev, ...fileArray]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const linksPayload = useMemo(
    () =>
      links
        .filter((link) => link.url?.trim())
        .map((link) => ({
          label: link.label?.trim() || "",
          url: link.url.trim(),
        })),
    [links]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const formData = new FormData();
      formData.append("username", profile.username || "");
      formData.append("profesion", profile.profesion || "");
      formData.append("especializacion", profile.especializacion || "");
      formData.append("description", profile.description || "");
      formData.append("email", profile.email || "");
      formData.append("status", profile.status || "");
      formData.append("city", profile.city || "");

      formData.append("links", JSON.stringify(linksPayload));

      if (removeImageIds.length) {
        formData.append("removeImageIds", JSON.stringify(removeImageIds));
      }

      newFiles.forEach((file) => {
        formData.append("images", file);
      });

      await updateUser(formData);
      await verifyUser();
      setStatus({
        type: "success",
        message: "Perfil actualizado correctamente.",
      });

      setRemoveImageIds([]);
      setNewFiles([]);
    } catch (error) {
      const message =
        error?.message || "No se pudo actualizar el perfil. Intenta nuevamente.";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8 space-y-6  mt-15 ">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Panel de divulgador
        </h1>
        <p className="text-base text-base-content/70">
          Actualiza tu informacion publica para que la comunidad conozca tu
          trabajo.
        </p>
      </header>

      {status.message ? (
        <div
          className={`alert ${
            status.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <ProfileForm values={profile} onFieldChange={handleFieldChange} />

            <SocialLinksEditor links={links} onChange={setLinks} />

            <ProfileImageUploader
              existingImages={existingImages}
              newFiles={newFiles}
              onAddFiles={handleAddFiles}
              onRemoveExisting={handleRemoveExisting}
              onRemoveNew={handleRemoveNewFile}
            />
          </div>

          <aside className="space-y-4">
        <ProfilePreviewCard
          profile={profile}
          specializationList={specializationList}
          previewImage={previewImage}
          links={previewLinks}
        />
          </aside>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn btn-primary ${submitting ? "loading" : ""}`}
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileEditor;
