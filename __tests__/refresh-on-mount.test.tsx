import { render } from '@testing-library/react'
import RefreshOnMount from '@/app/ui/refresh-on-mount'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('RefreshOnMount', () => {
  it('calls router.refresh when mounted', () => {
    const refresh = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ refresh })
    render(<RefreshOnMount />)
    expect(refresh).toHaveBeenCalled()
  })
})