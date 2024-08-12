// import { getXataClient } from '@/lib/xata'
import Form from "./Form";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { Metadata, ResolvingMetadata } from "next";
import { getFirestore } from "firebase/firestore";
import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/lib/firebase/serverApp";
import { getFormBySlug } from "@/lib/firebase/firestore";
export type PramsProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// export async function generateStaticParams() {
//   const forms = await xata.db.forms.getAll();

//   return forms.map((form) => ({
//     slug: form.slug,
//   }));
// }

export async function generateMetadata(
  { params }: PramsProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const form = await getFormBySlug(
    getFirestore(firebaseServerApp),
    params.slug,
  );

  if (!form) {
    return (await parent) as Metadata;
  }

  const previousImages = (await parent).openGraph?.images || [];
  const title = `${form?.name} by ${form?.createdBy?.name}`;
  const { description } = form;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description as string,
      images: previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description as string,
      images: previousImages,
    },
  };
}

export default async function Page({ params }: PramsProps) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const form = await getFormBySlug(
    getFirestore(firebaseServerApp),
    params.slug,
  );

  return form ? (
    <div className="p-12 w-full border border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{form?.name}</h1>
      <p className="text-sm text-gray-500">
        <i>created by:</i>{" "}
        <Link
          className="cursor-pointer underline underline-offset-4 dark:text-gray-300"
          href={`/user/${form?.createdBy?.id}`}
        >
          {form?.createdBy?.name || form?.createdBy?.email}
        </Link>
      </p>
      <p className="text-sm my-2">{form.description}</p>
      <div className="h-1 my-6 border border-gray-200 dark:border-gray-600"></div>
      <Form
        table={params.slug}
        owner={form?.createdBy?.name?.split(" ")[0] as string}
        fields={form?.page.fields}
      />
    </div>
  ) : (
    <div className="w-80 mx-auto sm:w-96 flex flex-col border border-gray-200 dark:border-gray-600 rounded-2xl p-6 md:p-12">
      <Image
        className="mx-auto"
        width={72}
        height={72}
        src="/formulate.svg"
        alt="FormUlate Logo"
      />
      <h1 className="my-6 text-center text-2xl">Form not found</h1>
      <p className="text-center">
        {
          "The form you are searching is not found! Please check the link again."
        }
      </p>
      <Link className="mx-auto mt-6" href={"/"}>
        <Button variant="secondary">Go to home</Button>
      </Link>
      <p className="text-xs text-center text-gray-400 my-4">
        If this is not what expected, let us know{" "}
        <Link
          className="underline underline-offset-4 text-blue-500"
          href="/form/contact-us"
        >
          here.
        </Link>
      </p>
    </div>
  );
}
