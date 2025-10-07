import { AddVocabHandler } from '@/components/AddVocab/AddVocabHandler';
import { Modal } from '@/components/layout';

export default function AddWordModal() {
  return (
    <Modal title={'Add Word'} showTitle={true}>
      <AddVocabHandler />
    </Modal>
  );
}
