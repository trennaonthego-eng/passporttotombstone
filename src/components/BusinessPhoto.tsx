import Image from "next/image";
import PlaceholderPhoto from "./PlaceholderPhoto";

/**
 * Renders a business's real uploaded photo when one exists, otherwise falls
 * back to the generated desert-scene placeholder. Only treats image_url as a
 * real photo when it points at our own Supabase Storage bucket — seed data
 * carries some hotlinked third-party URLs (from discovertombstone.com) that
 * are deliberately never rendered (copyright/hotlinking), so those still show
 * the placeholder until a VA uploads a real photo via /admin.
 */
function isUploadedPhoto(url: string | null | undefined): url is string {
  return Boolean(url && url.includes(".supabase.co/storage/"));
}

export default function BusinessPhoto({
  seed,
  imageUrl,
  alt,
  label,
  className = "",
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
}: {
  seed: string;
  imageUrl?: string | null;
  /** Accessibility text for a real photo. Not shown visually. */
  alt?: string;
  /** Caption rendered on top of the generated placeholder art only. */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (isUploadedPhoto(imageUrl)) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={alt ?? label ?? seed}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }
  return <PlaceholderPhoto seed={seed} label={label} className={className} />;
}
