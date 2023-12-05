import { ActionFunction, DataFunctionArgs, V2_MetaFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "input your validation" }];

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {

  const formData = await request.formData();
  
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  return redirect(redirectTo);
}


export default function FavoritesIndexPage() {

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Form method="post" className="space-y-6">
        <div classname="text-white text-2xl">
          <input 
            type="text" 
            name="non-terminals"
            placeholder="insira os simbolos não terminais"
          >
          </input>
        </div>
        <div>
          <input
            type="text"
            name="terminals"
            placeholder="insira os simbolos terminais"
          ></input>
        </div>
      </Form>
    </div>
  );
}
