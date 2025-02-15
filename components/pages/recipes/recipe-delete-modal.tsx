import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import { Endpoints } from "@/config/endpoints";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import { Recipe } from "@/types/recipe";
import { DialogTitle } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type RecipeDeleteModalProps = ModalProps & {
  recipe: Recipe;
};

export default function RecipeDeleteModal(props: RecipeDeleteModalProps) {
  const { recipe, setIsOpen } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteMutateAsync } = services.recipeService.useDelete({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Endpoints.Recipes] });
      router.push("/recipes");
    },
  });

  const handleDelete = async () => {
    await deleteMutateAsync(recipe);
  };

  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        Kas oled kindel, et soovid retsepti kustutada?
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
