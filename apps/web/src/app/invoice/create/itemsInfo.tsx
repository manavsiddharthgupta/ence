import InputPullback from '@/components/inputPullback'
import { ItemsInfoAction } from '@/types/invoice'
import { Dispatch, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { useInvoiceContext } from '@/context/invoice'

const ItemsInfo = () => {
  const { itemsInfoState, itemsInfoDispatch } = useInvoiceContext()

  useEffect(() => {
    itemsInfoDispatch({
      type: 'ADD_NEW_ITEM',
      payload: {
        index: itemsInfoState.length,
        value: ''
      }
    })
  }, [])

  const onAddNewItem = () => {
    itemsInfoDispatch({
      type: 'ADD_NEW_ITEM',
      payload: {
        index: itemsInfoState.length,
        value: ''
      }
    })
  }
  return (
    <>
      <h3 className='text-lg'>Items to bill</h3>
      {itemsInfoState.map((eachItem, index) => (
        <Item
          id={eachItem.id}
          index={index}
          key={eachItem.id}
          name={eachItem.name}
          price={eachItem.price}
          quantity={eachItem.quantity}
          total={eachItem.total}
          itemsInfoDispatch={itemsInfoDispatch}
        />
      ))}
      <Button
        className='border-dashed bg-transparent dark:border-zinc-600 border-zinc-400 hover:bg-zinc-100/80 hover:dark:bg-zinc-800/50 text-sm font-normal dark:text-zinc-400 text-zinc-600'
        variant='outline'
        size='sm'
        onClick={onAddNewItem}
      >
        <PlusIcon className='mr-1 dark:text-zinc-400 text-zinc-600' />
        Add Item
      </Button>
    </>
  )
}

const Item = ({
  id,
  index,
  name,
  price,
  quantity,
  total,
  itemsInfoDispatch
}: {
  id: string
  index: number
  name: string
  price: string | number
  quantity: string | number
  total: number
  itemsInfoDispatch: Dispatch<ItemsInfoAction>
}) => {
  const onChangeItemName = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemsInfoDispatch({
      type: 'ITEM_NAME',
      payload: { index: index, value: e.target.value }
    })
  }

  const onChangeItemQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemsInfoDispatch({
      type: 'ITEM_QUANTITY',
      payload: { index: index, value: e.target.value }
    })
  }

  const onChangeItemPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    itemsInfoDispatch({
      type: 'ITEM_PRICE',
      payload: { index: index, value: e.target.value }
    })
  }

  const onDeleteItem = () => {
    itemsInfoDispatch({
      type: 'DELETE_ITEM',
      payload: {
        index: index,
        value: id
      }
    })
  }

  return (
    <div className='flex mb-4 mt-2 gap-8 w-full items-center'>
      <div className='w-[48%]'>
        <InputPullback
          value={name}
          type='text'
          onChange={onChangeItemName}
          placeholder='Item'
        />
      </div>
      <div className='w-[12%]'>
        <InputPullback
          value={quantity}
          type='number'
          onChange={onChangeItemQuantity}
          placeholder='Quantity'
        />
      </div>
      <div className='w-[12%]'>
        <InputPullback
          value={price}
          type='number'
          onChange={onChangeItemPrice}
          placeholder='Price'
        />
      </div>
      <div className='w-[12%]'>
        <InputPullback
          value={total}
          type='number'
          placeholder='Total'
          readonly={true}
        />
      </div>
      <TrashIcon
        onClick={onDeleteItem}
        className='dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-100 hover:text-zinc-800 transition-colors duration-200 ease-in-out font-medium w-4 h-4 cursor-pointer'
      />
    </div>
  )
}
export default ItemsInfo
