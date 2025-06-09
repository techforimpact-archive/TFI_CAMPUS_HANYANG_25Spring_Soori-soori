import { SOORITheme } from '@/theme/theme'

import { EventModel } from '../models/models'

import { UseCase } from './use_case'

const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
/**
 * Discord Webhook을 통해 이벤트를 전송하는 UseCase
 *
 * @param event - 전송할 이벤트 모델
 */
export class EventCreateUseCase implements UseCase<Promise<void>, EventModel> {
  async call(value: EventModel): Promise<void> {
    if (!webhookUrl) return
    const colorHex = value.fatal ? SOORITheme.colors.error : SOORITheme.colors.primary
    const color = parseInt(colorHex.replace('#', ''), 16)
    const payload = {
      embeds: [
        {
          title: value.title,
          description: value.description,
          color,
        },
      ],
    }
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  }
}
