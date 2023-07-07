import { useField } from 'formik'
import { useMemo } from 'react'
import { ChevronIcon } from 'src/components/Chevron'
import { Select } from 'src/components/input/Select'
import { TokenId, getTokenById, getTokenOptionsByChainId } from 'src/config/tokens'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { useNetwork } from 'wagmi'

type Props = {
  name: string
  label: string
  onChange?: (optionValue: string) => void
}

const DEFAULT_VALUE = {
  label: 'Select Token',
  value: '',
}

export function TokenSelectField({ name, label, onChange }: Props) {
  const [field, , helpers] = useField<string>(name)

  const { chain } = useNetwork()
  const tokenOptions = useMemo(() => {
    return chain ? getTokenOptionsByChainId(chain.id) : Object.values(TokenId)
  }, [chain])

  const handleChange = (optionValue: string) => {
    helpers.setValue(optionValue || '')
    if (onChange) onChange(optionValue)
  }

  return (
    <Select
      value={field.value}
      optionValues={tokenOptions}
      onChange={handleChange}
      button={TokenButton}
      option={Option}
      buttonLabel={label}
    />
  )
}

function TokenButton(tokenId: string, buttonLabel?: string) {
  const token = getTokenById(tokenId)
  return (
    <div className="flex items-center p-1 rounded-md hover:bg-greengray-light transition-all">
      <TokenIcon size="l" token={token} />
      <div className="ml-3">
        <label className="text-xs text-gray-400 cursor-pointer">
          {buttonLabel || DEFAULT_VALUE.label}
        </label>
        <div className="flex items-center">
          <div>{token?.symbol || DEFAULT_VALUE.value}</div>
          <div className="ml-1">
            <ChevronIcon direction="s" width={12} height={6} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Option(tokenId: string, selected?: boolean) {
  const token = getTokenById(tokenId)
  return (
    <div
      className={`py-1.5 px-3 flex items-center cursor-pointer hover:bg-gray-100 ${
        selected ? 'bg-gray-50' : ''
      }`}
    >
      <TokenIcon size="xs" token={token} />
      <div className="ml-2.5">{token?.symbol || 'Unknown'}</div>
    </div>
  )
}
