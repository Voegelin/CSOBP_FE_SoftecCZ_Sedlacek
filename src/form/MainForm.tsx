/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
import { NestedFields } from './NestedFields';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export type FormData = {
  amount: number;
  allocation: number;
  damagedParts: string[];
  category: string;
  witnesses: { name: string; email: string }[];
};

export const MainForm = () => {
  type FormData = {
    amount: number;
    allocation: number;
    damagedParts: string[];
    category: string;
    witnesses: { name: string; email: string }[];
  };
  const initialValues = {
    amount: 250,
    allocation: 140,
    damagedParts: ['side', 'rear'],
    category: 'kitchen-accessories',
    witnesses: [
      {
        name: 'Marek',
        email: 'marek@email.cz',
      },
      {
        name: 'Emily',
        email: 'emily.johnson@x.dummyjson.com',
      },
    ],
  };

  const onSubmit = (data: FormData) => {
    try {
      console.log(data);
    } catch (validationErrors) {
      console.error(validationErrors);
    }
  };
  const validationSchema = Yup.object().shape({
    amount: Yup.number().min(0).max(300).required('Amount is required'),
    damagedParts: Yup.array()
      .min(1, 'At least one part must be selected')
      .required(),
  });
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<FormData>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <label>Amount: </label>
        <input type="number" {...register('amount')} />
        {errors.amount && (
          <p style={{ color: 'red' }}>{errors.amount.message}</p>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <label style={{ marginRight: 5 }}>Damaged Parts: </label>
        {damagedPartsOptions.map((opt) => (
          <div key={opt}>
            <input type="checkbox" value={opt} {...register('damagedParts')} />
            {opt}
          </div>
        ))}
        {errors.damagedParts && (
          <p style={{ color: 'red' }}>{errors.damagedParts.message}</p>
        )}
      </div>
      <NestedFields />
      <button type="submit">Dokončit</button>
    </form>
  );
};
