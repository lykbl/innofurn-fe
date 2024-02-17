import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';
import { ReactElement } from 'react';
import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import { buttonVariants } from '@/components/ui/common/button';

export const OAuthButtons = () => {
  const size = 16;
  const types = [
    {
      icon: <FaGithub size={size} />,
      label: 'GitHub',
      type: 'github',
    },
    {
      icon: <FaGoogle size={size} />,
      label: 'Google',
      type: 'google',
    },
    {
      icon: <FaLinkedin size={size} />,
      label: 'LinkedIn',
      type: 'linkedin',
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {types.map(
        (
          config: { icon: ReactElement; type: string; label: string },
          i: number,
        ) => (
          <BaseLink
            className={buttonVariants({
              variant: 'default',
              className: 'gap-2',
            })}
            key={i}
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${ROUTES.OAUTH_REDIRECT}/${config.type}`}
          >
            <span className="flex gap-2 w-1/5 items-center">
              {config.icon}
              {config.label}
            </span>
          </BaseLink>
        ),
      )}
    </div>
  );
};
