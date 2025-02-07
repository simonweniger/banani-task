import { z } from "zod";

export const iconNames = [
    'add',
    'alternate_email',
    'bookmark',
    'call',
    'checklist',
    'check',
    'check_box',
    'check_box_outline_blank',
    'close',
    'code',
    'credit_card',
    'download',
    'upload',
    'eco',
    'favorite',
    'fork_spoon',
    'globe',
    'key',
    'mail',
    'nature',
    'news',
    'nutrition',
    'play_arrow',
    'priority',
    'refresh',
    'redo',
    'replay',
    'sentiment_satisfied',
    'sentiment_dissatisfied',
    'settings',
    'shapes',
    'shield',
    'shopping_bag',
    'star',
    'thumb_down',
    'thumb_up',
    'zoom_out_map',
    'zoom_in_map',
    'videocam',
    'tune',
    'storefront',
    'explore',
    'home',
    'category',
    'search',
    'report',
    'pin_drop',
    'photo_camera',
    'image',
    'notifications',
    'movie',
    'verified',
    'person',
    'groups',
    'arrow_left_alt',
    'arrow_right_alt',
    'arrow_downward_alt',
    'arrow_upward_alt',
    'timer',
    'calendar_today',
    'chat_bubble',
    'inbox',
    'help',
    'support',
    'map',
    'fastfood',
    'flag',
    'payments',
    'save',
    'menu',
    'more_horiz',
    'delete',
    'remove',
    'ios_share',
    'info',
    'visibility',
    'schedule',
    'campaign',
    'account_circle',
  ] as const;

export const IconNameSchema = z.enum(iconNames);

export const TableCellContentSchema = z.object({
  text: z.string(),
  icon: z.object({
    name: IconNameSchema,
    position: z.enum(['before', 'after']).optional().default('before'),
    className: z.string().optional(),
  }).optional(),
});

export const TableStyleSchema = z.object({
  title: z.string(),
  bordered: z.boolean(),
  borderRadius: z
    .enum(["sm", "md", "lg", "xl", "2xl", "3xl", "full"])
    .optional(),
  header: z.object({
    className: z.string().optional(),
    cells: z.array(
      z.object({
        content: TableCellContentSchema,
        className: z.string().optional(),
      })
    ),
  }),
  rows: z.array(
    z.object({
      className: z.string().optional(),
      cells: z.array(
        z.object({
          content: TableCellContentSchema,
          className: z.string().optional(),
        })
      ),
    })
  ),
});

export type TableStyle = z.infer<typeof TableStyleSchema>;