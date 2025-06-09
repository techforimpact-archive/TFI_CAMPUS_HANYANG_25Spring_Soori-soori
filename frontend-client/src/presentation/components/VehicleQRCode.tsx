import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { QRCodeSVG } from 'qrcode.react'

interface VehicleQRCodeProps {
  vehicleId: string
}

export function VehicleQRCode({ vehicleId }: VehicleQRCodeProps) {
  const qrCodeUrl = `https://soo-ri.web.app/?vehicleId=${vehicleId}`

  return (
    <QRContainer>
      <QRHeader>
        <QRTitle>식별 QR 확인하기</QRTitle>
      </QRHeader>
      <QRCodeWrapper>
        <QRCodeSVG role="img" value={qrCodeUrl} size={200} aria-label={`현재 전동보장구에 대한 QR 코드입니다.`} />
      </QRCodeWrapper>
    </QRContainer>
  )
}

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 26px;
  padding: 15px 12px 45px 12px;
  border-radius: 24px;
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.colors.outline};
`

const QRHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const QRTitle = styled.h3`
  ${({ theme }: { theme: Theme }) => css`
    ${theme.typography.bodyMedium};
    color: ${theme.colors.primary};
  `}
`

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.background};
  border-radius: 8px;
`
