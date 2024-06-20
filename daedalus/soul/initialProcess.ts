
import { MentalProcess, useActions } from "@opensouls/engine";
import externalDialog from "./cognitiveSteps/externalDialog.js";

const gainsTrustWithTheUser: MentalProcess = async ({ workingMemory }) => {
  const { speak  } = useActions()

  const [withDialog, stream] = await externalDialog(
    workingMemory,
    `Talk to the user about your fear of {{entityName}}`,
    { stream: true, model: "quality" }
  );
  speak(stream);

  return withDialog;
}

export default gainsTrustWithTheUser
