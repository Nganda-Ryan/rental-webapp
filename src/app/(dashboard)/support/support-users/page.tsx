"use client"
import React, { useEffect, useState } from 'react';
import {
  Search,
  Mail,
  UserPlus,
  Phone,
  Trash2,
  UserX,
  UserCheck,
} from 'lucide-react';
import { NewSupportUserForm } from '@/components/feature/Support/NewSupportUserForm'; 
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Overlay from '@/components/Overlay';
import { AllRole, FormValues, ICreateUserParam, IUser, SeachUserParams } from '@/types/user';
import { MANAGER_PROFILE_OBJ_LIST } from '@/constant';
import { createUser, searchUser } from '@/actions/userAction';
import { getRoleBadge, getStatusBadge } from '@/lib/utils-component';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import Nodata from '@/components/error/Nodata';
import toast from 'react-hot-toast';
import { useRouter } from '@bprogress/next/app';
import { SuccessModal } from '@/components/Modal/SucessModal';
import { SkeletonTable } from '@/components/skeleton/SkeletonTable';
import Button from '@/components/ui/Button';
import { MANAGER_PROFILE_LIST } from '@/constant'
import { useAuth } from '@/context/AuthContext'




const SupportUsers = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [selectedRole, setSelectedRole] = useState<AllRole>('ALL');
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const router = useRouter();
  const { isAuthorized, loadingProfile } = useAuth();

  useEffect(() => {

    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      setIsFetchingUser(true);
      const payload: SeachUserParams = {
        orderBy: "U.NIU",
        term: "",
        orderMode: 'desc',
        offset: 0,
        limit: 1000,
        page: 1,
      } 

      const result = await searchUser(payload);
      if(result.data){
        const _userList: IUser[] = result.data.body.items.length > 0 ?
        result.data.body.items.filter((_user:any) =>(_user.RoleCode == 'ADMIN' || _user.RoleCode == 'SUPPORT'))
        .map((_user:any) => ({
          id: _user.Code,
          firstName: _user.user.Firstname,
          lastName: _user.user.Lastname,
          email: _user.user.Email,
          phone: _user.user.Phone,
          profile: [_user.RoleCode],
          gender: _user.user.Gender,
          city: _user.user.Address.City,
          street: _user.user.Address.Street,
          country: _user.user.Address.Country,
          avatarUrl: _user.user.AvatarUrl,
          status: _user.user.Status,
          NIU: _user.user.NIU,
        })) : [];
        console.log('-->result.data.body.items', result.data.body.items);
        setUserList(_userList);
      } else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log('SupportUsers.getUserList.error', error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      setIsFetchingUser(false);
    }
    

  }

  
  const filteredUsers = userList.filter((user) => selectedRole === 'ALL' || user.profile.includes(selectedRole))
  
  const usersTableColumn = [
    {
      key: 'userId',
      label: 'USER',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <div className="font-bold">{user.lastName} {user.firstName}</div>
            <div>NUI : {user.NIU}</div>
          </div>
      ),
    },
    {
      key: 'contact',
      label: 'CONTACT',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <div className="text-sm sm:text-base text-gray-800 dark:text-gray-100">
        <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
          <Mail size={14} /> {user.email}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
          <Phone size={14} /> {user.phone}
        </div>
      </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        {getStatusBadge(user.status)}
      </div>
      ),
    },
    {
        key: 'actions',
        label: 'Actions',
        priority: "high" as "high",
        render: (_: any, user: IUser) => (
            <div className="flex items-center justify-end md:justify-start gap-2">
          {user.status === 'ACTIVE' ? (
            <Button onClick={(e) => { e.stopPropagation(); handleDesactivateUser(user);}} variant='outline-danger' disable={false} isSubmitBtn={false} fullWidth={false}>
              <UserX size={16} />
              Deactivate
            </Button>
          ) : (
            <Button onClick={(e) => { e.stopPropagation(); handleActivateUser(user);}} variant='outline-success' disable={false} isSubmitBtn={false} fullWidth={false}>
              <UserCheck size={16} />
              Activate
            </Button>
          )}
        </div>

        ),
    },
  ]

  const handleDesactivateUser = async (user: IUser) => {
    console.log("-->handleDesactivateUser.user", user);
  }


  const handleActivateUser = async (user: IUser) => {
    console.log("-->handleActivateUser.user", user);
  }


  const handleSelectUSer = (userId: string) => {
    console.log('handleSelectUSer.userId', userId);
  }
  const handleNewUserSubmit = async (data: FormValues) => {
    console.log('New support user data:', data.country)
    try {
      const payload: ICreateUserParam = {
        "email": data.email,
        "phone": data.phone,
        "gender": data.gender,
        "lastname": data.lastName,
        "firstname":data.firstName,
        "password": data.password,
        "role": data.role,
        "addressData": {
          city: data.city,
          street: data.street,
          country: data.country
        }
      }
      const result = await createUser(payload);

      if(result?.data){
        setSuccessMessage("Admin created successfully");
        setShowSuccessModal(true)
      } else if (result?.error) {
        console.log('SupportUser.handleNewUser.result.error', result.error);
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log("SupportUser.handleNewUser.error", error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      if(showSuccessModal){
        await getUserList();
      }
      setShowNewUserForm(false);
    }
  };

  if (!loadingProfile && !isAuthorized(MANAGER_PROFILE_LIST)) {
    return <div>Unauthorized</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Support User" />

        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            {/* Input avec icône search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className='flex gap-4'>
              {/* Select role, avec largeur fixe pour ne pas être trop large */}
              <div className="w-full sm:w-auto">
                <select
                  className="w-full sm:w-[160px] px-4 py-2 border border-gray-200 rounded-lg"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                >
                  <option value="all">All Roles</option>
                  {MANAGER_PROFILE_OBJ_LIST.map(profile => (
                    <option key={profile.value} value={profile.value}>{profile.label}</option>
                  ))}
                </select>
              </div>

              {/* Bouton aligné correctement */}
              <div className="w-full sm:w-auto flex justify-end">
                <button
                  onClick={() => setShowNewUserForm(true)}
                  className="bg-[#2A4365] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto"
                >
                  <UserPlus size={18} />
                  Add Support User
                </button>
              </div>
            </div>
          </div>



          <div className="bg-transparent md:bg-white md:dark:bg-gray-800 rounded-lg md:shadow-sm overflow-hidden mb-5">
            {
              !isFetchingUser ? 
                userList.length > 0 && isFetchingUser == false ? (
                  <ResponsiveTable
                    columns={usersTableColumn}
                    data={userList.slice(0, 100)}
                    onRowClick={(user: IUser) => handleSelectUSer(user.id)}
                    keyField="id"
                    paginate={10}
                  />
                  ) : (
                  <Nodata message="No user to display" />
                )
                : 
              <SkeletonTable />
            }
          </div>
          


          <Overlay isOpen={showNewUserForm} onClose={() => setShowNewUserForm(false)}>
            <NewSupportUserForm
                isOpen={showNewUserForm}
                onClose={() => setShowNewUserForm(false)}
                onSubmit={handleNewUserSubmit}
              />
          </Overlay>
          <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
            <SuccessModal
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
          </Overlay>
        </div>
    </DefaultLayout>
  )
}

export default SupportUsers;
