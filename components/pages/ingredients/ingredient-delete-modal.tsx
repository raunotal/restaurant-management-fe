import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import { Endpoints } from "@/config/endpoints";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import { Ingredient } from "@/types/ingredient";
import { DialogTitle } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type IngredientDeleteModalProps = ModalProps & {
  ingredient: Ingredient;
};

export default function IngredientDeleteModal(
  props: IngredientDeleteModalProps
) {
  const { ingredient, setIsOpen } = props;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteMutateAsync } =
    services.ingredientService.useDelete({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [Endpoints.Ingredients] });
        router.push("/ingredients");
      },
    });

  const handleDelete = async () => {
    await deleteMutateAsync(ingredient);
  };

  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        Kas oled kindel, et soovid toorainet kustutada?
      </DialogTitle>
      <div className="flex justify-center mt-8 gap-4">
        <Button onClick={() => setIsOpen(false)} className="mr-2">
          Tühista
        </Button>
        <Button onClick={handleDelete} color="danger">
          Kustuta
        </Button>
      </div>
    </Modal>
  );
}
